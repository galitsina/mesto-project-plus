import { Request, Response, NextFunction } from 'express';
import { card } from '../models/card';
import {ISessionRequest} from '../middlewares/auth';
import { BAD_QUERY_ERROR, NOT_FOUND_ERROR, SERVER_ERROR, CREATED } from '../utils/const';
import { RequestError } from '../utils/RequestError';
;

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  card.find({})
    .then(card => res.send(card))
    .catch(next);
};

export const createCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  const owner = req.user?._id;
  if (!owner) {
    next(new RequestError(BAD_QUERY_ERROR, 'Необходима авторизация'));
    return;
  }
  const likes: string[] = [];

  card.create({ name, link, owner, likes })
    .then(card => res.status(CREATED).send({ id: card._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }});
}

export const deleteCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const cardId = req.params.cardId;
  const owner = req.user?._id;

  card.findOneAndDelete({_id: cardId, owner: owner})
    .then((card) => {
      if(card) {
        res.send(card);
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }})
    .catch(next);
};

export const likeCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;

  card.findByIdAndUpdate(id, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if(card) {
        res.send(card);
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }})
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
}

export const dislikeCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  const update: Record<string, any> = { $pull: { likes: req.user?._id } };

  card.findByIdAndUpdate( id, update,
    { new: true },)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }})
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные для снятии лайка'));
      } else {
        next(err);
      }
    });
}