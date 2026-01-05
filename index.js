import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import coursesRouter from './routes/courses.route.js';
import usersRouter from './routes/users.route.js';
import authRouter from './routes/auth.route.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const url = process.env.MONGO_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(url).then(() => {
  console.log('Mongodb Connected successfully');
})

app.use(cors());
app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    status: 'error',
    message: 'this resource is not available'
  })
})

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log('http://localhost:3000');
})
