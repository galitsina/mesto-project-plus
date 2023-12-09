import { Router } from 'express';
import { getUsers, getUser, updateUser, updateAvatar, returnCurrentUser } from '../controllers/user';
import { celebrate, Joi } from 'celebrate';

const userRouter = Router();
userRouter.get('/users', getUsers);
userRouter.get('/users/me', returnCurrentUser);
userRouter.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    })
  }),
  updateUser);
userRouter.patch('/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?.*/i),
    })
  }),
  updateAvatar);
userRouter.get('/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24),
    }),
  }),
  getUser);

export default userRouter;
