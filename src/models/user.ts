import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { BAD_QUERY_ERROR } from '../utils/const';
import RequestError from '../utils/RequestError';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface UserModel extends mongoose.Model<IUser> {
  // Abstract method disabled no-unused-vars rule
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
  Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: [200, 'Максимальная длина поля "name" - 200'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    match: /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?.*/i,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new RequestError(BAD_QUERY_ERROR, 'Неправильные почта или пароль');
      }

      return bcryptjs.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new RequestError(BAD_QUERY_ERROR, 'Неправильные почта или пароль');
          }
          return user;
        });
    });
});
const user = mongoose.model<IUser, UserModel>('user', userSchema);
export default user;
