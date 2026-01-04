import UserModel from '../models/user.model.js';
import asyncWrapper from '../middleware/asyncWrapper.js';
import { STATUS } from '../constants/httpStatus.js';

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const users = await UserModel.find().select("-password -__v").limit(limit).skip(skip);
  const total = await UserModel.countDocuments();

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
    data: users
  });
})

export default { getAllUsers }
