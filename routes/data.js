const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/', dataController.predict);

router.post('/', dataController.receiveData);

module.exports = router;
