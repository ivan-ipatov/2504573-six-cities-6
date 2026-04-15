import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true, _id: true } })
export class UserEntity {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true })
  public isPro!: boolean;

  @prop()
  public avatarUrl?: string;
}