import jwt from "jsonwebtoken";
import AppError from "../helpers/appError.js";
import { STATUS } from '../constants/httpStatus.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Not authorized", 401, STATUS.FAILED);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    req.user = decodedToken;
    console.log(decodedToken);
    next();
  } catch (err) {
    throw new AppError("Invalid token", 401, STATUS.FAILED);
  }
}
