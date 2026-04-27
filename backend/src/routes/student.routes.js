const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, studentController.getStudents);
router.get('/count', authenticate, studentController.getStudentCount);
router.get('/:id/attendance', authenticate, studentController.getStudentAttendance);
router.patch('/:id/batch', authenticate, studentController.updateStudentBatch);
router.delete('/:id', authenticate, studentController.deleteStudent);

module.exports = router;
