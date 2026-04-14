const express = require("express");
const { processTranscript } = require("../agent/agentController");

const router = express.Router();

router.post("/process", processTranscript);

module.exports = router;
