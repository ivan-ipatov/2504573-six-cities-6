import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { timestamps: true });

export const LocationModel = mongoose.model<ILocation>('Location', LocationSchema);