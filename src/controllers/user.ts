import { Request, Response, NextFunction } from 'express';
import { user } from  '../models/user';
import { ISessionRequest } from 'middlewares/auth';
import { BAD_QUERY_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } from '../utils/const';;
// import bcryptjs from 'bcryptjs';
// import jwt from 'jsonwebtoken';

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then(users => res.send(users))
    .catch(err =>
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

export const getUser = (req: Request, res: Response) => {
  const id = req.params.userId;
  if(!id) {
    return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
  }

  return user.findById(id)
    .then(user => res.send(user))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  if(!name || !about || !avatar) {
    return res.status(BAD_QUERY_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
  }

  return user.create({ name, about, avatar })
    .then(user => res.send({ id: user._id }))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));

};

export const updateUser = (req: ISessionRequest, res: Response) => {
  if(!req.body.name || !req.body.about) {
    return res.status(BAD_QUERY_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }
  if(!req.user?._id) {
    return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
  }

  return user.findByIdAndUpdate(req.user?._id, {name: req.body.name, about: req.body.about}, { new: true })
    .then(user => res.send({ id: user?._id }))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

export const updateAvatar = (req: ISessionRequest, res: Response) => {
  if(!req.body.avatar) {
    return res.status(BAD_QUERY_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }
  if(!req.user?._id) {
    return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
  }

  return user.findByIdAndUpdate(req.user?._id, {avatar: req.body.avatar}, { new: true })
    .then(user => res.send({ id: user?._id }))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
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

