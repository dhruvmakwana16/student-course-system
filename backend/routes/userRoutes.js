// const express = require("express");
// const router = express.Router();

// const { registerUser, loginUser } = require("../controllers/userController");
// const auth = require("../middleware/authMiddleware");
// const { forgotPassword, resetPassword } = require("../controllers/userController");
// const { sendOTP, verifyOTP } = require("../controllers/userController");

// // PUBLIC ROUTES
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// // PROTECTED ROUTE
// router.get("/profile", auth, (req, res) => {
//   res.json({ message: "Protected", user: req.user });
// });
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// router.get("/test", (req, res) => {
//   res.send("User route working ✅");
// });
// router.post("/send-otp", sendOTP);
// router.post("/verify-otp", verifyOTP);

// module.exports = router;



const express = require("express");
const router = express.Router();

// ✅ Controllers (ALL IN ONE)
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP
} = require("../controllers/userController");

// ✅ Middleware
const auth = require("../middleware/authMiddleware");

// ================= PUBLIC ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= PASSWORD RESET =================
router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);
router.post("/reset-password", resetPassword);

// ================= OTP ROUTES =================
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// ================= PROTECTED ROUTE =================
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Protected", user: req.user });
});

// ================= TEST =================
router.get("/test", (req, res) => {
  res.send("User route working ✅");
});

module.exports = router;