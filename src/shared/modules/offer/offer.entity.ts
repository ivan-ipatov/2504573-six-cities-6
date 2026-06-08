import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { AmenityType, City, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { LocationSchema } from './location.schema.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, trim: true, minlength: 10, maxlength: 100 })
  public title: string;

  @prop({ required: true, trim: true, minlength: 20, maxlength: 1024 })
  public description: string;

  @prop({ required: true, trim: true, type: () => String, enum: City })
  public city: City;

  @prop({ required: true, trim: true })
  public previewImage: string;

  @prop({ required: true, type: () => [String] })
  public housingImages: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, min: 0, max: 5, default: 0 })
  public rating: number;

  @prop({ required: true, type: () => String, enum: HousingType })
  public housingType: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public roomsCount: number;

  @prop({ required: true, min: 1, max: 10 })
  public guestsCount: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price: number;

  @prop({ required: true, type: () => [String], enum: AmenityType })
  public amenities: AmenityType[];

  @prop({ required: true, ref: UserEntity })
  public userId: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsCount: number;

  @prop({ required: true, _id: false, type: () => LocationSchema })
  public location: LocationSchema;
}

export const OfferModel = getModelForClass(OfferEntity);
