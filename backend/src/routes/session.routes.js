const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate, sessionController.createSession);
router.get('/', authenticate, sessionController.getSessionsByBatch);

module.exports = router;
