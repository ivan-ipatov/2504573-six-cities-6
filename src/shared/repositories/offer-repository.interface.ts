import { OfferEntity } from '../models/index.js';
import { Repository } from './base-repository.interface.js';

export interface OfferRepository extends Repository<OfferEntity> {
  findByCity(city: string): Promise<OfferEntity[]>;
}