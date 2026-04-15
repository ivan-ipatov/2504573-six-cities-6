import mongoose, { Schema, Document } from 'mongoose';

export type City = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
export type PropertyType = 'apartment' | 'house' | 'room' | 'hotel';

export interface IOffer extends Document {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: PropertyType;
  rooms: number;
  guests: number;
  price: number;
  facilities: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  postDate: { type: Date, required: true },
  city: { type: String, enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'], required: true },
  previewImage: { type: String, required: true },
  images: { type: [String], required: true },
  isPremium: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  rating: { type: Number, required: true },
  type: { type: String, enum: ['apartment', 'house', 'room', 'hotel'], required: true },
  rooms: { type: Number, required: true },
  guests: { type: Number, required: true },
  price: { type: Number, required: true },
  facilities: { type: [String], required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const OfferModel = mongoose.model<IOffer>('Offer', OfferSchema);