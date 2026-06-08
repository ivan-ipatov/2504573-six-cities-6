import { User } from './user.type.js';
import { HousingType } from './housing-type.enum.js';
import { AmenityType } from './amenity-type.enum.js';
import { Location } from './location.type.js';
import { City } from './city.enum.js';

export type HousingImages = [string, string, string, string, string, string];

export type Offer = {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  housingImages: HousingImages;
  isPremium: boolean;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: AmenityType[];
  author: User;
  location: Location;
};
