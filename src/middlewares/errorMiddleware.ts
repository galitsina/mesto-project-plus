import { ErrorRequestHandler, NextFunction } from 'express';
import RequestError from '../utils/RequestError';

const errorHandler: ErrorRequestHandler = (err: RequestError, req, res, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

export default errorHandler;
