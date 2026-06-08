import { Expose } from 'class-transformer';

export class PreviewOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose({ name: 'createdAt'})
  public publishDate: Date;

  @Expose()
  public city: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public housingType: string;

  @Expose()
  public price: number;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;
}
