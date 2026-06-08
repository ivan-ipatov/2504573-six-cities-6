import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, trim: true, minlength: 1, maxlength: 15 })
  public name: string;

  @prop({ required: true, unique: true, trim: true })
  public email: string;

  @prop()
  public avatar?: string;

  @prop({ required: true, type: () => String, enum: UserType, default: UserType.Default })
  public type: UserType;

  @prop({ required: true })
  private password?: string;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
