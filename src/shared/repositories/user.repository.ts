import { injectable } from 'inversify';
import { getModelForClass } from '@typegoose/typegoose';
import { UserEntity } from '../models/index.js';
import { UserRepository } from './user-repository.interface.js';

@injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly model = getModelForClass(UserEntity);

  async findById(id: string): Promise<UserEntity | null> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<UserEntity[]> {
    return this.model.find().exec();
  }

  async create(item: Partial<UserEntity>): Promise<UserEntity> {
    return this.model.create(item);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.model.findOne({ email }).exec();
  }
}