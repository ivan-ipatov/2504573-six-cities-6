import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  isPro: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  isPro: { type: Boolean, required: true },
  avatarUrl: { type: String },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', UserSchema);