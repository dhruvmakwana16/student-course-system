const mongoose = require("mongoose");


students: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
]
const schema = new mongoose.Schema(
  {
    // your fields
  },
  { timestamps: true } // ✅ VERY IMPORTANT
);

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  instructor: String,
  image: String
});
module.exports = mongoose.model("Course", courseSchema);