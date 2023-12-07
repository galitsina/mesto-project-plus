import mongoose, {Schema, ObjectId} from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {type: String,
        minLength: [2, 'Минимальная длина поля - 2'],
        maxLength: [30, 'Максимальная длина поля - 30'],
        required: [true, 'Поле должно быть заполнено']
      },
  link: {type: String,
        required: [true, 'Поле должно быть заполнено'],
        match: /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/i
      },
  owner: {type: mongoose.Types.ObjectId,
          required: true,
        ref: "user"},
  likes: {type: [mongoose.Types.ObjectId],
          default: [],
        ref: "user"},
  createdAt: {type: Date,
              default: Date.now}
}, {versionKey: false});

export const card = mongoose.model<ICard>('card', cardSchema);