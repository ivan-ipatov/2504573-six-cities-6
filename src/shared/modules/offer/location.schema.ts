import { prop } from '@typegoose/typegoose';

export class LocationSchema {
  @prop({ required: true, min: -90, max: 90 })
  public latitude!: number;

  @prop({ required: true, min: -180, max: 180 })
  public longitude!: number;
}
