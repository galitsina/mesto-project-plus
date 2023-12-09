import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload }  from 'jsonwebtoken';
import { UNAUTHORIZED_ERROR } from '../utils/const';

export interface ISessionRequest extends Request {
  user?: {
    _id: string,
  }
}

export const authMiddleware = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if( !authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, 'some-secret-key') as JwtPayload;
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }

  req.user = {_id: payload._id};
  next();
};