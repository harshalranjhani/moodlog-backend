const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/predict', dataController.predict);
router.post('/suggestions', dataController.getSuggestions);
router.post('/receive', dataController.receiveData);

module.exports = router;
