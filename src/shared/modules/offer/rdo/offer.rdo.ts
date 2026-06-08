import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { PreviewOfferRdo } from './preview-offer.rdo.js';
import { Location } from '../../../types/index.js';

export class OfferRdo extends PreviewOfferRdo {
  @Expose()
  public description: string;

  @Expose()
  public housingImages: string[];

  @Expose()
  public roomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public amenities: string[];

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public location: Location;
}
