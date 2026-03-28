const Course = require("../models/Course");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    const { range } = req.query;

    let filter = {};

    // ✅ Date filter (optional)
    if (range === "7") {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      filter.createdAt = { $gte: last7Days };
    }

    if (range === "30") {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      filter.createdAt = { $gte: last30Days };
    }

    // ✅ Counts
    const totalUsers = await User.countDocuments(filter);
    const totalCourses = await Course.countDocuments(filter);

    // ✅ Get all courses with students
    const allCourses = await Course.find(filter).populate("students");

    // ✅ Total enrollments
    const totalEnrollments = allCourses.reduce(
      (total, course) => total + (course.students?.length || 0),
      0
    );

    // ✅ Chart data (IMPORTANT for frontend)
    const stats = allCourses.map((course) => ({
      name: course.title,
      students: course.students?.length || 0
    }));

    // ✅ Final response
res.json({
  users,
  courses: courses.length,
  enrollments,
  topCourses,
  categoryStats
});
        const topCourses = courses
      .map((c) => ({
        title: c.title,
        students: c.students?.length || 0
      }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 3);

    // ✅ Category count
    const categoryStats = {};
    courses.forEach((c) => {
      categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};