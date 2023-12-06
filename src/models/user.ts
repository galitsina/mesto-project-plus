import mongoose, {Schema} from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {type: String,
    minLength: 2,
    maxLength: 30,
    required: true
  },
  about: {type: String,
    minLength: 2,
    maxLength: 200,
    required: true
  },
  avatar: {type: String,
    required: true,
    match: /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?.*/i
  }
});

export const user = mongoose.model<IUser>('user', userSchema);