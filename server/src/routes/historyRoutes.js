const express = require('express');
const router = express.Router();
const {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
} = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getHistory);
router.get('/:id', protect, getHistoryItem);
router.delete('/:id', protect, deleteHistoryItem);

module.exports = router;
