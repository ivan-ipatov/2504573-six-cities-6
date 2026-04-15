import { injectable } from 'inversify';
import { UserModel, IUser } from '../models/index.js';
import { UserRepository } from './user-repository.interface.js';

@injectable()
export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }

  async findAll(): Promise<IUser[]> {
    return UserModel.find().exec();
  }

  async create(item: Partial<IUser>): Promise<IUser> {
    return UserModel.create(item);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }
}