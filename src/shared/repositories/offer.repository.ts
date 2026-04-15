import { injectable } from 'inversify';
import { getModelForClass } from '@typegoose/typegoose';
import { OfferEntity } from '../models/index.js';
import { OfferRepository } from './offer-repository.interface.js';

@injectable()
export class OfferRepositoryImpl implements OfferRepository {
  private readonly model = getModelForClass(OfferEntity);

  async findById(id: string): Promise<OfferEntity | null> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<OfferEntity[]> {
    return this.model.find().exec();
  }

  async create(item: Partial<OfferEntity>): Promise<OfferEntity> {
    return this.model.create(item);
  }

  async findByCity(city: string): Promise<OfferEntity[]> {
    return this.model.find({ city }).exec();
  }
}