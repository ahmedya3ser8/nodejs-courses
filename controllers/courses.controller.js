import mongoose from 'mongoose';
import CourseModel from '../models/course.model.js';
import addCourseschema from "../validations/courses.schema.js";
import asyncWrapper from '../middleware/asyncWrapper.js';
import AppError from '../helpers/appError.js';
import { STATUS } from '../constants/httpStatus.js';

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  // const courses = await CourseModel.find({ price: { $gt: 2800 } });
  const courses = await CourseModel.find({}, { "__v": false }).limit(limit).skip(skip);
  const total = await CourseModel.countDocuments();

  const totalPages = Math.ceil(total / limit);
  const nextPage = page < totalPages ? page + 1 : null;

  return res.status(200).json({
    status: STATUS.SUCCESS,
    pagination: {
      currentPage: page,
      limit: limit,
      totalPages: totalPages,
      nextPage: nextPage
    },
    data: courses
  });
})

const getCourse = asyncWrapper( async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
    throw new AppError("Invalid Object Id", 400, STATUS.FAILED);
  }
  const course = await CourseModel.findById(req.params.courseId)
  if (!course) {
    throw new AppError("Course not found", 404, STATUS.ERROR);
  }
  return res.status(200).json({
    status: STATUS.SUCCESS,
    data: course
  });
})

const addCourse = asyncWrapper(async (req, res) => {
  const { error } = addCourseschema.safeParse(req.body);
  if (error) {
    return res.status(400).json({
      status: STATUS.FAILED,
      data: error.issues.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
  const newCourse =  new CourseModel(req.body);
  await newCourse.save();
  return res.status(201).json({
    status: STATUS.SUCCESS,
    data: newCourse
  });
})

const updateCourse = asyncWrapper(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
    throw new AppError("Invalid Object Id", 400, STATUS.FAILED);
  }
  const updatedCourse = await CourseModel.findByIdAndUpdate(req.params.courseId, { $set: {...req.body} }, { new: true }); // new true --> to return update one
  if (!updatedCourse) {
    throw new AppError("Course not found", 404, STATUS.ERROR);
  }
  return res.status(200).json({
    status: STATUS.SUCCESS,
    data: updatedCourse
  });
})

const deleteCourse = asyncWrapper(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
    throw new AppError("Invalid Object Id", 400, STATUS.FAILED);
  }
  const deletedCourse = await CourseModel.deleteOne({ _id: req.params.courseId })
  if (deletedCourse.deletedCount === 0) {
    throw new AppError("Course not found", 404, STATUS.ERROR);
  }
  return res.status(200).json({
    status: STATUS.SUCCESS,
    data: { message: 'Course deleted successfully' }
  });
})

export default { getAllCourses, getCourse, addCourse, updateCourse, deleteCourse }
