import { Request, Response, NextFunction } from 'express';
import { user } from '../models/user';
import { ISessionRequest } from '../middlewares/auth';
import { BAD_QUERY_ERROR, CREATED, NOT_FOUND_ERROR, CONFLICT_ERROR } from '../utils/const';
import { RequestError } from '../utils/RequestError';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        console.log(err.message)
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при поиске пользователя'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  bcryptjs.hash(password, 10).
    then((passwordHash: string) => {
      user.create({ name, about, avatar, email, password: passwordHash })
        .then(user => res.status(CREATED).send({ id: user._id }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при создании пользователя'));
          } else if (err.code === 11000) {
            next(new RequestError(CONFLICT_ERROR, 'Пользователь с таким email уже существует'));
          }
          else {
            next(err);
          }
        });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  user.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
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
      }
    });
};

export const updateAvatar = (req: ISessionRequest, res: Response, next: NextFunction) => {
  user.findByIdAndUpdate(req.user?._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ id: user?._id })
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
}

export const returnCurrentUser = (req: ISessionRequest, res: Response, next: NextFunction) => {
  user.findById(req.user?._id)
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