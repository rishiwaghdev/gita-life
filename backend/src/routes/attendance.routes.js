const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate, attendanceController.markAttendance);
router.get('/session/:sessionId', authenticate, attendanceController.getSessionAttendance);

module.exports = router;
