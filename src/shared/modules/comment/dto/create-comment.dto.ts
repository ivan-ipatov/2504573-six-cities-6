import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Comment text is required' })
  @MinLength(5, { message: 'Min length is 5' })
  @MaxLength(1024, { message: 'Max length is 1024' })
  public text!: string;

  @IsInt({ message: 'Rating must be integer' })
  @Min(1, { message: 'Min rating is 1' })
  @Max(5, { message: 'Max rating is 5' })
  public rating!: number;

  @IsMongoId({ message: 'Offer id must be valid mongo id' })
  public offerId!: string;

  public userId?: string;
}
