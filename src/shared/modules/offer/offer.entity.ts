import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { City, OfferType } from '../../types/index.js';
import { CategoryEntity } from '../category/category.entity.js';
import { UserEntity } from '../user/user.entity.js';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({trim: true})
  public description!: string;

  @prop()
  public postDate!: Date;

  @prop({
    type: () => String,
    enum: City
  })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ type: () => [String], required: true })
  public images!: string[];

  @prop({ default: false })
  public isPremium!: boolean;

  @prop({ default: false })
  public isFavorite!: boolean;

  @prop({ default: 0 })
  public rating!: number;

  @prop({
    type: () => String,
    enum: OfferType
  })
  public type!: OfferType;

  @prop({ required: true })
  public rooms!: number;

  @prop({ required: true })
  public guests!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ type: () => [String], required: true })
  public facilities!: string[];

  @prop({default: 0})
  public commentCount!: number;

  @prop({
    type: () => Object,
    required: true
  })
  public coordinates!: Coordinates;

  @prop({
    ref: () => CategoryEntity,
    required: true,
    default: []
  })
  public categories!: Ref<CategoryEntity>[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
