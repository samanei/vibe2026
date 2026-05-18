const express = require('express');
const router = express.Router();
const db = require('../db');

// 문의 작성
router.post('/', async (req, res) => {
  try {
    const { category, title, content, department, user_token } = req.body;
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
    const { user_token } = req.query;
    const [rows] = await db.query(
      'SELECT * FROM inquiries WHERE user_token = ? ORDER BY created_at DESC',
      [user_token]
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
