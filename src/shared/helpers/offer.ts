import { AmenityType, City, HousingImages, HousingType, Location, Offer, UserType } from '../types/index.js';

function getEnumValue<T extends Record<string, string>>(enumObject: T, value: string, fieldName: string): T[keyof T] {
  const enumValue = Object.values(enumObject).find((item) => item === value);

  if (!enumValue) {
    throw new Error(`Invalid ${fieldName}: ${value}`);
  }

  return enumValue as T[keyof T];
}

function parseHousingImages(value: string): HousingImages {
  const images = value.split(';');

  if (images.length !== 6) {
    throw new Error(`Invalid housingImages count: ${images.length}`);
  }

  return images as HousingImages;
}

export function createOffer(offerData: string): Offer {
  const [title, description, city, previewImage, images, isPremium, housingType, roomsCount, guestsCount, price, amenities,
    name, email, userType, location] = offerData.replace('\n', '').split('\t');

  const parseBoolean = (value: string): boolean => value === 'true';
  const parseInt = (value: string): number => Number.parseInt(value, 10);
  const parseLocation = (value: string): Location => {
    const [latitude, longitude] = value.split(';').map(Number);
    return { latitude, longitude };
  };

  return {
    title,
    description,
    city: getEnumValue(City, city, 'city'),
    previewImage,
    housingImages: parseHousingImages(images),
    isPremium: parseBoolean(isPremium),
    housingType: getEnumValue(HousingType, housingType, 'housingType'),
    roomsCount: parseInt(roomsCount),
    guestsCount: parseInt(guestsCount),
    price: parseInt(price),
    amenities: amenities.split(';').map((amenity) => getEnumValue(AmenityType, amenity, 'amenity')),
    author: {
      name: name,
      email: email,
      type: getEnumValue(UserType, userType, 'userType')
    },
    location: parseLocation(location)
  };
}
