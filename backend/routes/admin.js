// 관리자 대시보드 API 라우트를 제공하는 Express 라우터
const express = require('express');
const router = express.Router();
const db = require('../db');
const { buildDashboardData } = require('../lib/adminDashboard');
const { ADMIN_AGENDA_STATUSES, buildStatusCounts, normalizeAdminAgenda } = require('../lib/adminAgenda');

router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await buildDashboardData(db);
    res.json({ data: dashboard });
  } catch (err) {
    res.status(500).json({ message: '관리자 대시보드 정보를 불러오지 못했습니다.' });
  }
});

router.get('/agendas', async (req, res) => {
  try {
    const { keyword = '', status = '전체' } = req.query;
    const where = [];
    const params = [];

    if (keyword.trim()) {
      where.push('title LIKE ?');
      params.push(`%${keyword.trim()}%`);
    }

    if (status && status !== '전체') {
      where.push('status = ?');
      params.push(status);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const [rows] = await db.query(
      `
        SELECT id, title, category, department, status, agree_count, disagree_count, created_at
        FROM agendas
        ${whereSql}
        ORDER BY
          COALESCE(agree_count / NULLIF(agree_count + disagree_count, 0), 0) DESC,
          agree_count DESC,
          created_at DESC
      `,
      params
    );
    const [countRows] = await db.query(`
      SELECT status, COUNT(*) AS value
      FROM agendas
      GROUP BY status
    `);

    res.json({
      data: rows.map(normalizeAdminAgenda),
      status_counts: buildStatusCounts(countRows),
    });
  } catch (err) {
    res.status(500).json({ message: '안건 목록을 불러오지 못했습니다.' });
  }
});

router.patch('/agendas/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!ADMIN_AGENDA_STATUSES.includes(status)) {
      return res.status(400).json({ message: '유효하지 않은 처리 상태입니다.' });
    }

    const [result] = await db.query('UPDATE agendas SET status = ? WHERE id = ?', [status, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '삭제된 안건입니다.' });
    }

    await db.query('INSERT INTO agenda_timeline (agenda_id, status) VALUES (?, ?)', [req.params.id, status]);
    res.json({ message: '처리 상태가 변경되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '처리 상태를 변경하지 못했습니다.' });
  }
});

module.exports = router;
