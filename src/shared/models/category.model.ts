import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true, _id: true } })
export class CategoryEntity {
  @prop({ required: true, unique: true })
  public name!: string;
}