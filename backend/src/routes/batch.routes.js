const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batch.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate, batchController.createBatch);
router.get('/', authenticate, batchController.getBatches);
router.get('/count', authenticate, batchController.getBatchCount);
router.get('/:id', authenticate, batchController.getBatchById);
router.delete('/:id', authenticate, batchController.deleteBatch);

module.exports = router;
