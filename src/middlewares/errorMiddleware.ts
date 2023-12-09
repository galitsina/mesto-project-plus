import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log('Обработчик ошибок:', err.message, err.stack);
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
}

