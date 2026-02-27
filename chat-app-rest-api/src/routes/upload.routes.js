const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");

router.post("/signed-url", uploadController.getSignedUrl);

module.exports = router; // ✅ THIS LINE IS CRITICAL
