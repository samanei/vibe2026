const express = require('express');
const router = express.Router();
const db = require('../db');

const CATEGORIES = ['시설', '수업', '행정', '복지', '학식', '행사', '학생회', '기타'];
const VOTE_TYPES = ['agree', 'disagree'];

async function fetchAgendaDetail(agendaId, userToken) {
  const [[agenda]] = await db.query('SELECT * FROM agendas WHERE id = ?', [agendaId]);
  if (!agenda) return null;

  const [timeline] = await db.query(
    'SELECT * FROM agenda_timeline WHERE agenda_id = ? ORDER BY created_at ASC',
    [agendaId]
  );

  let userVote = null;
  if (userToken) {
    const [[vote]] = await db.query(
      'SELECT vote_type FROM votes WHERE agenda_id = ? AND user_token = ?',
      [agendaId, userToken]
    );
    userVote = vote?.vote_type ?? null;
  }

  return { ...agenda, timeline, user_vote: userVote };
}

// 이번 주 현황
router.get('/stats/weekly', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT
        COALESCE(SUM(YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)), 0) AS new_count,
        COALESCE(SUM(status = '반영 완료' AND YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)), 0) AS done_count,
        COALESCE(SUM(status = '검토 중'), 0) AS reviewing_count,
        COALESCE((SELECT SUM(agree_count + disagree_count) FROM agendas
         WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)), 0) AS total_votes
      FROM agendas
    `);
    res.json({ data: stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 안건 목록 조회
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'popular', page = 1, limit = 10 } = req.query;
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const offset = (pageNumber - 1) * limitNumber;

    let where = '';
    const params = [];
    if (category && category !== '전체') {
      where = 'WHERE category = ?';
      params.push(category);
    }

    const orderMap = {
      popular: 'agree_count DESC, created_at DESC',
      latest:  'created_at DESC',
      rate:    'COALESCE(agree_count / NULLIF(agree_count + disagree_count, 0), 0) DESC, agree_count DESC',
    };
    const order = orderMap[sort] || orderMap.popular;

    const [rows] = await db.query(
      `SELECT * FROM agendas ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...params, limitNumber, offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM agendas ${where}`,
      params
    );
    const [categoryRows] = await db.query(
      'SELECT category, COUNT(*) AS count FROM agendas GROUP BY category'
    );
    const category_counts = categoryRows.reduce(
      (acc, row) => ({ ...acc, [row.category]: row.count }),
      { 전체: categoryRows.reduce((sum, row) => sum + row.count, 0) }
    );

    res.json({ data: rows, total, page: pageNumber, limit: limitNumber, category_counts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 안건 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const agenda = await fetchAgendaDetail(req.params.id, req.query.user_token);
    if (!agenda) return res.status(404).json({ message: '삭제된 안건입니다.' });

    res.json({ data: agenda });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 안건 작성
router.post('/', async (req, res) => {
  try {
    const category = String(req.body.category || '').trim();
    const title = String(req.body.title || '').trim();
    const problem_description = String(req.body.problem_description || '').trim();
    const improvement_request = String(req.body.improvement_request || '').trim();
    const department = String(req.body.department || '익명').trim() || '익명';

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: '카테고리를 선택해주세요.' });
    }
    if (!title || title.length > 50) {
      return res.status(400).json({ message: '안건 제목은 1자 이상 50자 이하로 입력해주세요.' });
    }
    if (!problem_description || !improvement_request) {
      return res.status(400).json({ message: '문제 상황과 개선 요청을 모두 입력해주세요.' });
    }

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
    const vote_type = String(req.body.vote_type || '').trim();
    const user_token = String(req.body.user_token || '').trim();
    const agendaId = req.params.id;

    if (!VOTE_TYPES.includes(vote_type)) {
      return res.status(400).json({ message: '투표 종류가 올바르지 않습니다.' });
    }
    if (!user_token) {
      return res.status(401).json({ message: '로그인 후 투표할 수 있습니다.' });
    }

    const [[agenda]] = await db.query('SELECT id FROM agendas WHERE id = ?', [agendaId]);
    if (!agenda) return res.status(404).json({ message: '삭제된 안건입니다.' });

    const [[existing]] = await db.query(
      'SELECT * FROM votes WHERE agenda_id = ? AND user_token = ?',
      [agendaId, user_token]
    );

    if (existing) {
      if (existing.vote_type !== vote_type) {
        await db.query(
          'UPDATE votes SET vote_type = ? WHERE agenda_id = ? AND user_token = ?',
          [vote_type, agendaId, user_token]
        );
      }
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

    const updatedAgenda = await fetchAgendaDetail(agendaId, user_token);
    res.json({ message: '투표가 반영되었습니다.', data: updatedAgenda });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
