const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', leadController.createLead); // Public route
router.get('/', authenticate, leadController.getLeads);
router.get('/count', authenticate, leadController.getLeadCount);
router.post('/:id/convert', authenticate, leadController.convertLead);
router.post('/:id/send-message', authenticate, leadController.sendThankYouMessage);
router.delete('/:id', authenticate, leadController.deleteLead);

module.exports = router;
