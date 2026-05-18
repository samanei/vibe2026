const express = require('express');
const router = express.Router();
const db = require('../db');

// 안건 목록 조회
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'popular', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let where = '';
    const params = [];
    if (category && category !== '전체') {
      where = 'WHERE category = ?';
      params.push(category);
    }

    const orderMap = {
      popular: 'agree_count DESC',
      latest:  'created_at DESC',
      rate:    '(agree_count / NULLIF(agree_count + disagree_count, 0)) DESC',
    };
    const order = orderMap[sort] || orderMap.popular;

    const [rows] = await db.query(
      `SELECT * FROM agendas ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM agendas ${where}`,
      params
    );

    res.json({ data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 안건 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const [[agenda]] = await db.query('SELECT * FROM agendas WHERE id = ?', [req.params.id]);
    if (!agenda) return res.status(404).json({ message: '삭제된 안건입니다.' });

    const [timeline] = await db.query(
      'SELECT * FROM agenda_timeline WHERE agenda_id = ? ORDER BY created_at ASC',
      [req.params.id]
    );

    res.json({ data: { ...agenda, timeline } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 안건 작성
router.post('/', async (req, res) => {
  try {
    const { category, title, problem_description, improvement_request, department } = req.body;
    const [result] = await db.query(
      `INSERT INTO agendas (category, title, problem_description, improvement_request, department)
       VALUES (?, ?, ?, ?, ?)`,
      [category, title, problem_description, improvement_request, department]
    );
    const agendaId = result.insertId;

    await db.query(
      `INSERT INTO agenda_timeline (agenda_id, status) VALUES (?, '접수됨')`,
      [agendaId]
    );

    res.status(201).json({ message: '안건이 등록되었습니다.', data: { id: agendaId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 투표
router.post('/:id/vote', async (req, res) => {
  try {
    const { vote_type, user_token } = req.body;
    const agendaId = req.params.id;

    const [[existing]] = await db.query(
      'SELECT * FROM votes WHERE agenda_id = ? AND user_token = ?',
      [agendaId, user_token]
    );

    if (existing) {
      if (existing.vote_type === vote_type) {
        return res.status(409).json({ message: '이미 동일한 투표를 하셨습니다.' });
      }
      await db.query(
        'UPDATE votes SET vote_type = ? WHERE agenda_id = ? AND user_token = ?',
        [vote_type, agendaId, user_token]
      );
    } else {
      await db.query(
        'INSERT INTO votes (agenda_id, user_token, vote_type) VALUES (?, ?, ?)',
        [agendaId, user_token, vote_type]
      );
    }

    await db.query(
      `UPDATE agendas SET
        agree_count    = (SELECT COUNT(*) FROM votes WHERE agenda_id = ? AND vote_type = 'agree'),
        disagree_count = (SELECT COUNT(*) FROM votes WHERE agenda_id = ? AND vote_type = 'disagree')
       WHERE id = ?`,
      [agendaId, agendaId, agendaId]
    );

    res.json({ message: '투표가 반영되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 이번 주 현황
router.get('/stats/weekly', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT
        SUM(YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS new_count,
        SUM(status = '반영 완료' AND YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS done_count,
        SUM(status = '검토 중') AS reviewing_count,
        (SELECT SUM(agree_count + disagree_count) FROM agendas
         WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS total_votes
      FROM agendas
    `);
    res.json({ data: stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
