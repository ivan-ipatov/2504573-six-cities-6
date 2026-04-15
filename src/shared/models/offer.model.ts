import { prop, modelOptions } from '@typegoose/typegoose';

export type City =
  | 'Paris'
  | 'Cologne'
  | 'Brussels'
  | 'Amsterdam'
  | 'Hamburg'
  | 'Dusseldorf';

export type PropertyType = 'apartment' | 'house' | 'room' | 'hotel';

@modelOptions({ schemaOptions: { timestamps: true, _id: true } })
export class OfferEntity {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({ required: true, enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, enum: ['apartment', 'house', 'room', 'hotel'] })
  public type!: PropertyType;

  @prop({ required: true })
  public rooms!: number;

  @prop({ required: true })
  public guests!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, type: () => [String] })
  public facilities!: string[];

  @prop({ required: true, ref: 'UserEntity' })
  public author!: string;
}