// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,

  

//   role: { 
//     type: String, 
//     default: "student" 
//   },
  

//   // ✅ Enrolled Courses (Relation with Course model)
//   enrolledCourses: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course"
//     }
//   ],
//   resetToken: String,
//   resetTokenExpire: Date,
//   otp: String,
//   otpExpire: Date,
   
// },
//  { timestamps: true } );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: { 
      type: String, 
      unique: true 
    },

    password: String,

    role: { 
      type: String, 
      default: "student" 
    },

    // ✅ UPDATED Enrolled Courses (with progress + completion)
    enrolledCourses: [
      {
        courseId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Course" 
        },

        progress: { 
          type: Number, 
          default: 0 
        },

        completed: { 
          type: Boolean, 
          default: false 
        }
      }
    ],

    // 🔐 Auth fields
    resetToken: String,
    resetTokenExpire: Date,
    otp: String,
    otpExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);