import { Request, Response, NextFunction } from 'express';
import { user } from '../models/user';
import { ISessionRequest } from '../middlewares/auth';
import { BAD_QUERY_ERROR, CREATED, NOT_FOUND_ERROR, SERVER_ERROR } from '../utils/const';
import { RequestError } from '../utils/RequestError';
// import bcryptjs from 'bcryptjs';
// import jwt from 'jsonwebtoken';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  user.find({})
    .then(users => res.send(users))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;

  user.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при поиске пользователя'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  user.create({ name, about, avatar })
    .then(user => res.status(CREATED).send({ id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }});
};

export const updateUser = (req: ISessionRequest, res: Response, next: NextFunction) => {
  user.findByIdAndUpdate(req.user?._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ id: user?._id })
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Пользователь с указанным _id не найден');
      }
      })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }});
};

export const updateAvatar = (req: ISessionRequest, res: Response, next: NextFunction) => {
  user.findByIdAndUpdate(req.user?._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .then((user) => {
      if(user) {
        res.send({ id: user?._id })
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Пользователь с указанным _id не найден');
      }})
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
}

// export const createUser = (req: Request, res: Response, next: NextFunction) => {
//   bcryptjs.hash(req.body.password, 10)
//     .then(hash => user.create({
//       email: req.body.email,
//       password: hash, // записываем хеш в базу
//     }))
//     .then((user) => res.send(user))
//     .catch((err) => res.status(400).send(err));
// };

