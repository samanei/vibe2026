const express = require('express');
const router = express.Router();
const db = require('../db');

const CATEGORIES = ['장학금', '학비', '휴학', '복학', '행사', '부스 신청', '학생회 운영', '제보', '기타'];

// 문의 작성
router.post('/', async (req, res) => {
  try {
    const category = String(req.body.category || '').trim();
    const title = String(req.body.title || '').trim();
    const content = String(req.body.content || '').trim();
    const department = String(req.body.department || '익명').trim() || '익명';
    const user_token = String(req.body.user_token || '').trim();

    if (!user_token) {
      return res.status(401).json({ message: '로그인 후 문의를 등록할 수 있습니다.' });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: '문의 유형을 선택해주세요.' });
    }
    if (!title) {
      return res.status(400).json({ message: '문의 제목을 입력해주세요.' });
    }
    if (!content || content.length > 1000) {
      return res.status(400).json({ message: '문의 내용은 1자 이상 1,000자 이하로 입력해주세요.' });
    }

    const [result] = await db.query(
      `INSERT INTO inquiries (category, title, content, department, user_token)
       VALUES (?, ?, ?, ?, ?)`,
      [category, title, content, department, user_token]
    );
    res.status(201).json({ message: '문의가 등록되었습니다.', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 내 문의함
router.get('/my', async (req, res) => {
  try {
    const user_token = String(req.query.user_token || '').trim();

    if (!user_token) {
      return res.status(401).json({ message: '로그인 후 내 문의함을 확인할 수 있습니다.' });
    }

    const [rows] = await db.query(
      'SELECT * FROM inquiries WHERE user_token = ? ORDER BY created_at DESC',
      [user_token]
    );

    const stats = rows.reduce(
      (acc, row) => {
        acc.total += 1;
        if (row.status === '답변 완료') acc.done += 1;
        if (row.status === '검토 중') acc.reviewing += 1;
        if (row.status === '답변 대기') acc.waiting += 1;
        return acc;
      },
      { total: 0, done: 0, waiting: 0, reviewing: 0 }
    );

    res.json({ data: rows, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
