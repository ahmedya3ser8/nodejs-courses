import { STATUS } from '../constants/httpStatus.js';

const errorHandler = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || STATUS.ERROR,
    message: err.message || 'Something went wrong'
  })
}

export default errorHandler;
