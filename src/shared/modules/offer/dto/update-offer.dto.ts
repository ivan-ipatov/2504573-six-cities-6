import { AmenityType, City, HousingType, Location } from '../../../types/index.js';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength, ValidateNested, } from 'class-validator';
import { OfferValidationMessages } from './offer.messages.js';
import { LocationDto } from './create-offer.dto.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10,{ message: OfferValidationMessages.title.minLength })
  @MaxLength(100, { message: OfferValidationMessages.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: OfferValidationMessages.description.minLength })
  @MaxLength(1024, { message: OfferValidationMessages.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: OfferValidationMessages.city.invalidFormat })
  public city?: City;

  @IsOptional()
  @IsString({ message: OfferValidationMessages.previewImage.invalidFormat })
  @IsUrl({}, { message: OfferValidationMessages.previewImage.invalidFormat })
  @MaxLength(256, { message: OfferValidationMessages.previewImage.maxLength })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: OfferValidationMessages.housingImages.invalidFormat })
  @ArrayMinSize(6, { message: OfferValidationMessages.housingImages.size })
  @ArrayMaxSize(6, { message: OfferValidationMessages.housingImages.size })
  @IsUrl({}, { each: true, message: OfferValidationMessages.housingImages.itemInvalidFormat })
  public housingImages?: string[];

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessages.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, { message: OfferValidationMessages.housingType.invalidFormat })
  public housingType?: HousingType;

  @IsOptional()
  @IsInt({ message: OfferValidationMessages.roomsCount.invalidFormat })
  @Min(1, { message: OfferValidationMessages.roomsCount.minValue })
  @Max(8, { message: OfferValidationMessages.roomsCount.maxValue })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessages.guestsCount.invalidFormat })
  @Min(1, { message: OfferValidationMessages.guestsCount.minValue })
  @Max(10, { message: OfferValidationMessages.guestsCount.maxValue })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessages.price.invalidFormat })
  @Min(100, { message: OfferValidationMessages.price.minValue })
  @Max(100000, { message: OfferValidationMessages.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: OfferValidationMessages.amenities.isArray })
  @IsEnum(AmenityType, { each: true, message: OfferValidationMessages.amenities.invalidFormat })
  public amenities?: AmenityType[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  public location?: Location;
}
