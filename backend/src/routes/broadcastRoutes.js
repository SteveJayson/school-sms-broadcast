const express = require('express');
const router = express.Router();
const broadcastController = require('../controllers/broadcastController');
// const { authenticate } = require('../middleware/auth');

// router.use(authenticate);

router.post('/send', broadcastController.sendBroadcast);
router.get('/history', broadcastController.getBroadcastHistory);
router.get('/balance', broadcastController.checkBalance);

module.exports = router;