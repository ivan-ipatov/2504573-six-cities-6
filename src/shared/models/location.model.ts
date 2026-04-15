import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true, _id: true } })
export class LocationEntity {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}