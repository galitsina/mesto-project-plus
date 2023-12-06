import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { ISessionRequest } from './middlewares/auth';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req: ISessionRequest, res, next) => {
  req.user = {
    _id: '6570a71ded27e4452cec55bc'
  };
  next();
})

app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

