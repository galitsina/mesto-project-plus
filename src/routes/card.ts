import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from '../controllers/card';
import { celebrate, Joi } from 'celebrate';

const cardRouter = Router();
cardRouter.get('/cards', getCards);

cardRouter.post('/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string().pattern(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?.*/i),
    })
  }),
  createCard);

cardRouter.delete('/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24),
    }),
  }),
  deleteCard);

cardRouter.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24),
    })
  }),
  likeCard);

cardRouter.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24),
    })
  }),
  dislikeCard);

export default cardRouter;