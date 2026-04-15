import { Offer, City } from '../types/offer.type.js';
import { MockOffer } from '../types/mock-offer.type.js';
import { RandomUtils } from '../utils/random.utils.js';

/**
 * Service for generating random offer data based on mock templates
 */
export class OfferGenerator {
  private readonly cities: City[] = [
    'Paris',
    'Cologne',
    'Brussels',
    'Amsterdam',
    'Hamburg',
    'Dusseldorf',
  ];

  private readonly propertyTypes: Array<'apartment' | 'house' | 'room' | 'hotel'> = [
    'apartment',
    'house',
    'room',
    'hotel',
  ];

  private readonly facilitiesPool = [
    'Wi-Fi',
    'TV',
    'Kitchen',
    'Washing machine',
    'Swimming pool',
    'Parking',
    'Air conditioning',
    'Bar',
    'Concierge',
    'Gym',
    'Balcony',
  ];

  /**
   * Generate a single offer based on template
   */
  public generateOffer(template: MockOffer): Offer {
    return {
      title: this.generateTitle(template.title),
      description: this.generateDescription(template.description),
      postDate: RandomUtils.getRandomDate(),
      city: RandomUtils.getRandomElement(this.cities),
      previewImage: template.previewImage,
      images: RandomUtils.getRandomElements(template.images, RandomUtils.getRandomNumber(2, 4)),
      isPremium: Math.random() > 0.5,
      isFavorite: false,
      rating: RandomUtils.getRandomDecimal(3.5, 5.0),
      type: RandomUtils.getRandomElement(this.propertyTypes),
      rooms: RandomUtils.getRandomNumber(1, 5),
      guests: RandomUtils.getRandomNumber(1, 10),
      price: RandomUtils.getRandomNumber(25, 500),
      facilities: RandomUtils.getRandomElements(
        this.facilitiesPool,
        RandomUtils.getRandomNumber(2, 6)
      ),
      author: this.generateAuthorName(template.author),
    };
  }

  /**
   * Generate multiple offers
   */
  public generateOffers(templates: MockOffer[], count: number): Offer[] {
    const offers: Offer[] = [];
    for (let i = 0; i < count; i++) {
      const template = RandomUtils.getRandomElement(templates);
      offers.push(this.generateOffer(template));
    }
    return offers;
  }

  private generateTitle(_baseTitle: string): string {
    const adjectives = ['Beautiful', 'Cozy', 'Charming', 'Modern', 'Luxury', 'Spacious'];
    const types = ['apartment', 'house', 'room', 'hotel'];
    const adjective = RandomUtils.getRandomElement(adjectives);
    const type = RandomUtils.getRandomElement(types);
    return `${adjective} ${type}`;
  }

  private generateDescription(_baseDescription: string): string {
    const descriptions = [
      'A wonderful place to stay',
      'Perfect for travelers',
      'Comfortable and affordable',
      'Excellent location with great amenities',
      'Ideal for families and groups',
      'Modern and well-equipped',
    ];
    return RandomUtils.getRandomElement(descriptions);
  }

  private generateAuthorName(_baseName: string): string {
    const firstNames = [
      'John',
      'Jane',
      'Bob',
      'Alice',
      'Charlie',
      'Diana',
      'Edward',
      'Fiona',
    ];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Evans', 'Miller', 'Garcia'];
    const firstName = RandomUtils.getRandomElement(firstNames);
    const lastName = RandomUtils.getRandomElement(lastNames);
    return `${firstName} ${lastName}`;
  }
}
