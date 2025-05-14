const express = require("express");
const router = express.Router();
const { suggestClub } = require("../controllers/suggestionController");

router.post("/", suggestClub);

module.exports = router;
