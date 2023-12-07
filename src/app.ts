import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { ISessionRequest } from './middlewares/auth';
import { errorHandler } from './middlewares/errorMiddleware';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req: ISessionRequest, res, next) => {
  req.user = {
    _id: '6571fb0831268df2dfd498ac'
  };
  next();
})

app.use('/', userRouter);
app.use('/', cardRouter);


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

