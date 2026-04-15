import { IUser } from '../models/index.js';
import { Repository } from './base-repository.interface.js';

export interface UserRepository extends Repository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}