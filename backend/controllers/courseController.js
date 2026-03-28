const User = require("../models/User");
const Course = require("../models/Course");



// // ================= ADD COURSE =================
// exports.addCourse = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);

//     const { title, description, instructor, category } = req.body;

//     const imageName = req.file ? req.file.filename : "no-image.jpg";

//     console.log("SAVING IMAGE:", imageName); // DEBUG

//     const course = new Course({
//       title,
//       description,
//       instructor,
//       // image: req.file ? req.file.filename : "no-image.jpg"
//       category,
//       image: imageName
//     });
//     await course.save();

//     const io = req.app.get("io");
//     io.emit("dashboardUpdate");
//     res.json(course);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// ================= ADD COURSE =================
exports.addCourse = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, instructor, category } = req.body;

    const imageName = req.file ? req.file.filename : "no-image.jpg";

    console.log("SAVING IMAGE:", imageName); // DEBUG

    const course = new Course({
      title,
      description,
      instructor,
      category,
      image: imageName
    });

    await course.save();

    const io = req.app.get("io");
    io.emit("dashboardUpdate");

    res.json(course);

  } catch (err) {
    console.error("ADD COURSE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET COURSES =================
exports.getCourses = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const category = req.query.category;

    const limit = 5;
    const skip = (page - 1) * limit;

    // ✅ Build query
    let query = {
      title: { $regex: search, $options: "i" }
    };

    if (category && category !== "All") {
      query.category = category;
    }

    // ✅ Fetch courses
    const courses = await Course.find(query)
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error("GET COURSES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};




// ================= ENROLL COURSE =================
// exports.enrollCourse = async (req, res) => {
//   try {
//     console.log("USER:", req.user); // DEBUG

//     const userId = req.user.id;
//     const courseId = req.params.id;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.enrolledCourses.includes(courseId)) {
//       return res.status(400).json({ message: "Already enrolled" });
//     }

//     user.enrolledCourses.push(courseId);
//     await user.save();

//     res.json({ message: "Enrolled successfully" });

//   } catch (err) {
//     console.error("ENROLL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// ================= ENROLL COURSE =================
exports.enrollCourse = async (req, res) => {
  try {
    console.log("USER:", req.user); // DEBUG

    const userId = req.user.id || req.user._id;
    const courseId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check already enrolled
    // const alreadyEnrolled = user.enrolledCourses.find(
    //   (c) => c.courseId.toString() === courseId
    // );

    const alreadyEnrolled = user.enrolledCourses.find(
  (c) =>
    c.courseId &&
    c.courseId.toString() === courseId
);

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // ✅ Add course
    user.enrolledCourses.push({
      courseId,
      progress: 0,
      completed: false,
    });

    await user.save();

    res.json({ message: "Enrolled successfully" });

  } catch (err) {
    console.error("ENROLL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// ================= GET MY COURSES =================
exports.getMyCourses = async (req, res) => {
  try {
    console.log("USER:", req.user); // DEBUG

    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId)
      .populate("enrolledCourses.courseId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.enrolledCourses);

  } catch (err) {
    console.error("GET MY COURSES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
// ================= DELETE COURSE =================
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await Course.findByIdAndDelete(courseId);

    res.json({ message: "Course deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE COURSE =================
exports.updateCourse = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// exports.getCourses = async (req, res) => {
//   try {
//     const search = req.query.search || "";
//     const page = parseInt(req.query.page) || 1;
//     const limit = 5;

//     const skip = (page - 1) * limit;

//     const courses = await Course.find({
//       title: { $regex: search, $options: "i" }
//     })
//       .skip(skip)
//       .limit(limit);

//     const total = await Course.countDocuments({
//       title: { $regex: search, $options: "i" }
//     });

//     res.json({
//       courses,
//       totalPages: Math.ceil(total / limit)
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

//const User = require("../models/User");
//const Course = require("../models/Course");



// ================= ADD COURSE =================
exports.addCourse = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, instructor, category } = req.body;

    const imageName = req.file ? req.file.filename : "no-image.jpg";

    console.log("SAVING IMAGE:", imageName); // DEBUG

    const course = new Course({
      title,
      description,
      instructor,
      // image: req.file ? req.file.filename : "no-image.jpg"
      category,
      image: imageName
    });
    await course.save();

    const io = req.app.get("io");
    io.emit("dashboardUpdate");
    res.json(course);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// // ================= GET COURSES =================
// exports.getCourses = async (req, res) => {
//   try {
//     const search = req.query.search || "";
//     const page = parseInt(req.query.page) || 1;
//     const category = req.query.category;

//     const limit = 5;
//     const skip = (page - 1) * limit;

//     // ✅ Query build
//     let query = {
//       title: { $regex: search, $options: "i" }
//     };

//     if (category && category !== "All") {
//       query.category = category;
//     }

//     // ✅ THIS PART (you asked)
//     const courses = await Course.find(query)
//       .skip(skip)
//       .limit(limit);

//     const total = await Course.countDocuments(query);

//     res.json({
//       courses,
//       totalPages: Math.ceil(total / limit)
//     });

//   } catch (err) {
//     console.error("GET COURSES ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };




// ================= ENROLL COURSE =================
// exports.enrollCourse = async (req, res) => {
//   try {
//     console.log("USER:", req.user); // DEBUG

//     const userId = req.user.id;
//     const courseId = req.params.id;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.enrolledCourses.includes(courseId)) {
//       return res.status(400).json({ message: "Already enrolled" });
//     }

//     user.enrolledCourses.push(courseId);
//     await user.save();

//     res.json({ message: "Enrolled successfully" });

//   } catch (err) {
//     console.error("ENROLL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };




// exports.enrollCourse = async (req, res) => {
//   try {
//     console.log("USER:", req.user); // DEBUG

//     const userId = req.user.id;
//     const courseId = req.params.id;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // ✅ Check already enrolled (NEW LOGIC)
//     const alreadyEnrolled = user.enrolledCourses.find(
//       (c) => c.courseId.toString() === courseId
//     );

//     if (alreadyEnrolled) {
//       return res.status(400).json({ message: "Already enrolled" });
//     }

//     // ✅ Push new structure (IMPORTANT CHANGE)
//     user.enrolledCourses.push({
//       courseId: courseId,
//       progress: 0,
//       completed: false,
//     });

//     await user.save();

//     res.json({ message: "Enrolled successfully" });

//   } catch (err) {
//     console.error("ENROLL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



// ================= GET MY COURSES =================
// exports.getMyCourses = async (req, res) => {
//   try {
//     console.log("USER:", req.user); // DEBUG
//     const userId = req.user.id || req.user._id;

//     const user = await User.findById(userId)
//   .populate("enrolledCourses.courseId");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user.enrolledCourses);

//   } catch (err) {
//     console.error("GET MY COURSES ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// ================= DELETE COURSE =================
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await Course.findByIdAndDelete(courseId);

    res.json({ message: "Course deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE COURSE =================
exports.updateCourse = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// exports.getCourses = async (req, res) => {
//   try {
//     const search = req.query.search || "";
//     const page = parseInt(req.query.page) || 1;
//     const limit = 5;

//     const skip = (page - 1) * limit;

//     const courses = await Course.find({
//       title: { $regex: search, $options: "i" }
//     })
//       .skip(skip)
//       .limit(limit);

//     const total = await Course.countDocuments({
//       title: { $regex: search, $options: "i" }
//     });

//     res.json({
//       courses,
//       totalPages: Math.ceil(total / limit)
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const user = await User.findById(req.user.id);

    const course = user.enrolledCourses.find(
      (c) => c.courseId.toString() === req.params.id
    );

    if (!course) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    course.progress = progress;
    course.completed = progress === 100;

    await user.save();

    res.json({ message: "Progress updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

