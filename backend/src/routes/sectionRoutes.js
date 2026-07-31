const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
// const { authenticate } = require('../middleware/auth');

// router.use(authenticate);

router.get('/', sectionController.getSections);
router.post('/', sectionController.createSection);
router.put('/:id', sectionController.updateSection);

module.exports = router;