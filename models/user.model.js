import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'firstName is required']
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  role: {
    type: String,
    enum: {
      values: Object.values(ROLES),
      message: '{VALUE} is not a valid role'
    },
    default: ROLES.USER
  },
  avatar: {
    type: String,
    default: 'uploads/profile.jpg'
  }
})

export default mongoose.model('User', userSchema);
