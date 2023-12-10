import { Request, Response, NextFunction } from 'express';
import card from '../models/card';
import { ISessionRequest } from '../middlewares/auth';
import { BAD_QUERY_ERROR, NOT_FOUND_ERROR, CREATED } from '../utils/const';
import RequestError from '../utils/RequestError';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  card.find({})
    .then((cardDocument) => res.send(cardDocument))
    .catch(next);
};

export const createCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  card.create({ name, link, owner })
    .then((cardDocument) => res.status(CREATED).send({ id: cardDocument._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const cardOwner = req.user?._id;

  card.findOneAndDelete({ _id: cardId })
    .then((cardDocument) => {
      if (cardDocument) {
        if (cardDocument.owner.toString() === cardOwner) {
          res.send(cardDocument);
        } else {
          throw new RequestError(BAD_QUERY_ERROR, 'Нельзя удалять чужие карточки');
        }
        res.send(cardDocument);
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }
    })
    .catch(next);
};

export const likeCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;

  card.findByIdAndUpdate(id, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((cardDocument) => {
      if (cardDocument) {
        res.send(cardDocument);
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  const update: Record<string, any> = { $pull: { likes: req.user?._id } };

  card.findByIdAndUpdate(
    id,
    update,
    { new: true },
  )
    .then((cardDocument) => {
      if (cardDocument) {
        res.send(cardDocument);
      } else {
        throw new RequestError(NOT_FOUND_ERROR, 'Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(BAD_QUERY_ERROR, 'Переданы некорректные данные для снятии лайка'));
      } else {
        next(err);
      }
    });
};
