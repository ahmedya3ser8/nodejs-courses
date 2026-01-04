import AppError from "../helpers/appError.js";
import { STATUS } from '../constants/httpStatus.js';

export const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403, STATUS.ERROR)
    }
    next();
  }
}
