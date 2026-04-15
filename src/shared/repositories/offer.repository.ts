import { injectable } from 'inversify';
import { OfferModel, IOffer } from '../models/index.js';
import { OfferRepository } from './offer-repository.interface.js';

@injectable()
export class OfferRepositoryImpl implements OfferRepository {
  async findById(id: string): Promise<IOffer | null> {
    return OfferModel.findById(id).exec();
  }

  async findAll(): Promise<IOffer[]> {
    return OfferModel.find().exec();
  }

  async create(item: Partial<IOffer>): Promise<IOffer> {
    return OfferModel.create(item);
  }

  async findByCity(city: string): Promise<IOffer[]> {
    return OfferModel.find({ city }).exec();
  }
}