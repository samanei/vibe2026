// 관리자 대시보드 API 라우트를 제공하는 Express 라우터
const express = require('express');
const router = express.Router();
const db = require('../db');
const { buildDashboardData } = require('../lib/adminDashboard');

router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await buildDashboardData(db);
    res.json({ data: dashboard });
  } catch (err) {
    res.status(500).json({ message: '관리자 대시보드 정보를 불러오지 못했습니다.' });
  }
});

module.exports = router;
