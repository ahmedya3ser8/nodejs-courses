import express from 'express';
import authController from '../controllers/auth.controller.js';
import multer from 'multer';
import AppError from '../helpers/appError.js';
import { STATUS } from '../constants/httpStatus.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    const extImage = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${extImage}`;
    cb(null, fileName);
  }
})

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
    return cb(null, true);
  } else {
    return cb(new AppError('file must be an image', 400, STATUS.FAILED), false);
  }
}

const upload = multer({ storage, fileFilter });

router.route('/register')
  .post(upload.single('avatar'), authController.register)

router.route('/login')
  .post(authController.login)

export default router;
