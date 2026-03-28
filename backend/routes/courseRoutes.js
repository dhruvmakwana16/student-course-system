const express = require("express");
const router = express.Router();

// ✅ Controllers
const {
  addCourse,
  getCourses,
  getMyCourses,
  enrollCourse,

  deleteCourse,
  updateCourse
} = require("../controllers/courseController");
const { updateProgress } = require("../controllers/courseController");
// ✅ Middlewares
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

// ✅ Test Route
router.get("/", (req, res) => {
  res.json({ message: "Courses route working ✅" });
});

// ✅ Add Course
router.post("/add", auth, role("admin"), upload.single("image"), addCourse);

// ✅ FIRST (IMPORTANT ORDER)
router.get("/all", auth, getCourses);
router.get("/my-courses", auth, getMyCourses);

// ✅ Get Single Course (KEEP AFTER ABOVE ROUTES)
router.get("/:id", auth, async (req, res) => {
  try {
    const Course = require("../models/Course");

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Enroll
router.post("/enroll/:id", auth, enrollCourse);

// ✅ Delete
router.delete("/delete/:id", auth, role("admin"), deleteCourse);

// ✅ Update
router.put("/update/:id", auth, role("admin"), updateCourse);
router.get(
  "/dashboard",
  auth,              // ✅ first
  adminMiddleware,   // ✅ second
  getDashboardStats  // ✅ third
);
// ✅ DEBUG (temporary)
console.log("auth:", typeof auth);
console.log("updateProgress:", typeof updateProgress);

// ✅ ROUTES
router.put("/progress/:id", auth, updateProgress);

module.exports = router;