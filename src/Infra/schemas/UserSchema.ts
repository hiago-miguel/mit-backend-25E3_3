import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username é obrigatório'],
    unique: true,
    trim: true,
    minlength: [3, 'Username deve ter pelo menos 3 caracteres'],
    maxlength: [30, 'Username deve ter no máximo 30 caracteres'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e underscore'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email deve ter formato válido'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [8, 'Senha deve ter pelo menos 8 caracteres'],
    maxlength: [128, 'Senha deve ter no máximo 128 caracteres']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'Role deve ser admin ou user'
    },
    default: 'user',
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
    delete (ret as any).__v;
    return ret;
  }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
