import bcrypt from "bcryptjs";
import UserModel from '../models/user.model.js';
import asyncWrapper from '../middleware/asyncWrapper.js';
import AppError from "../helpers/appError.js";
import { generateToken } from "../helpers/generateToken.js";
import { STATUS } from "../constants/httpStatus.js";

const register = asyncWrapper(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new AppError("All fields are required", 400, STATUS.FAILED);
  }

  const oldUser = await UserModel.findOne({ email: email });
  if (oldUser) {
    throw new AppError("User already exists", 409, STATUS.FAILED);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  })

  await newUser.save();
  
  newUser.password = undefined;

  return res.status(201).json({
    status: STATUS.SUCCESS,
    message: 'User registered successfully',
    data: {
      newUser
    }
  });
})

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new AppError("email and password are required", 400, STATUS.FAILED);
  }

  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new AppError("user not found", 401, STATUS.FAILED);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    throw new AppError("invalid email or password", 401, STATUS.FAILED);
  }

  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role
  })

  user.password = undefined;

  return res.status(200).json({
    status: STATUS.SUCCESS,
    message: 'logged in successfully',
    data: {
      user,
      token
    }
  });
})

export default { register, login }
