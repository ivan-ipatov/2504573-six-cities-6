import { IOffer } from '../models/index.js';
import { Repository } from './base-repository.interface.js';

export interface OfferRepository extends Repository<IOffer> {
  findByCity(city: string): Promise<IOffer[]>;
}