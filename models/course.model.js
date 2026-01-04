import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})

export default mongoose.model('Course', courseSchema); // uppercase and course --> by default it transform to Courses
