import { Router } from 'express';
import { getUsers, createUser, getUser, updateUser, updateAvatar} from '../controllers/user';

const userRouter = Router();
userRouter.get('/users', getUsers);
userRouter.post('/users', createUser);
userRouter.get('/users/:userId', getUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

export default userRouter;
