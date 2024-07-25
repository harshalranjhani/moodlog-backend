const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/suggestions", dataController.getSuggestions);

module.exports = router;