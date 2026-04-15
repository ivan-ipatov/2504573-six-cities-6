import { UserEntity } from '../models/index.js';
import { Repository } from './base-repository.interface.js';

export interface UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}