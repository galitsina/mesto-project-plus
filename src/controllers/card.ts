import { Request, Response, NextFunction } from 'express';
import { card } from '../models/card';
import {ISessionRequest} from '../middlewares/auth';
import { BAD_QUERY_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } from '../utils/const';;

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return card.find({})
    .then(card => res.send(card))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

export const createCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  if(!name || !link) {
    return res.status(BAD_QUERY_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
  };

  const owner = req.user?._id;
  if (!owner) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const likes: string[] = [];

  return card.create({ name, link, owner, likes })
    .then(card => res.send({ id: card._id }))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
}

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.cardId;

  if(!id) {
    return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
  }

  return card.findByIdAndRemove(id)
    .then(card => res.send(card))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

export const likeCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;

  if(!id) {
    return res.status(BAD_QUERY_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }

  return card.findByIdAndUpdate(id, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then(card => res.send(card))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Передан несуществующий _id карточки.' }));
}

export const dislikeCard = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  const update: Record<string, any> = { $pull: { likes: req.user?._id } }; // убрать _id из массива

  if(!id) {
    return res.status(BAD_QUERY_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
  }

  return card.findByIdAndUpdate( id, update,
    { new: true },)
    .then(card => res.send(card))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Передан несуществующий _id карточки.' }));
}