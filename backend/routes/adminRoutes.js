const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");

// 🔥 Dashboard API
router.get("/dashboard", getDashboardStats);

module.exports = router;