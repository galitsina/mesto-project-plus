import { Request } from 'express';

export interface ISessionRequest extends Request {
  user?: {
    _id: string
  }
}