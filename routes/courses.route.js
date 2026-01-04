import express from 'express';
import coursesController from '../controllers/courses.controller.js';
import { protect } from '../middleware/protect.js';
import { allowedTo } from '../middleware/roles.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.route('/')
  .get(coursesController.getAllCourses)
  .post(protect, coursesController.addCourse)

router.route('/:courseId')
  .get(coursesController.getCourse)
  .patch(protect, allowedTo(ROLES.ADMIN), coursesController.updateCourse)
  .delete(protect, allowedTo(ROLES.ADMIN), coursesController.deleteCourse)

export default router;
