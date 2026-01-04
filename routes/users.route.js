import express from 'express';
import usersController from '../controllers/users.controller.js';
import { protect } from '../middleware/protect.js';
import { allowedTo } from '../middleware/roles.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.route('/')
  .get(protect, allowedTo(ROLES.ADMIN), usersController.getAllUsers)

export default router;
