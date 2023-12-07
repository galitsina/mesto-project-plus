import mongoose, {Schema} from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {type: String,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: [30, 'Максимальная длина поля "name" - 30'],
    required: [true, 'Поле должно быть заполнено']
  },
  about: {type: String,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: [200, 'Максимальная длина поля "name" - 200'],
    required: [true, 'Поле должно быть заполнено']
  },
  avatar: {type: String,
    required: true,
    match: /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?.*/i
  }
}, {versionKey: false});

export const user = mongoose.model<IUser>('user', userSchema);