import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, getUser, updateUser, updateAvatar, returnCurrentUser,
} from '../controllers/user';

const userRouter = Router();
userRouter.get('/users', getUsers);
userRouter.get('/users/me', returnCurrentUser);
userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
    }),
  }),
  updateUser,
);
userRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?.*/i).required(),
    }),
  }),
  updateAvatar,
);
userRouter.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser,
);

export default userRouter;
