import { Container } from 'inversify';
import { Logger, PinoLogger } from '../logger/index.js';
import { Config, loadConfig } from '../config/index.js';
import { Application } from '../../../app/application.js';
import { UserRepository, UserRepositoryImpl } from '../../repositories/index.js';
import { OfferRepository, OfferRepositoryImpl } from '../../repositories/index.js';

export function createContainer(): Container {
  const container = new Container();

  const config = loadConfig();
  container.bind<Config>('Config').toConstantValue(config);

  container.bind<Logger>('Logger').to(PinoLogger).inSingletonScope();

  container.bind<UserRepository>('UserRepository').to(UserRepositoryImpl).inSingletonScope();
  container.bind<OfferRepository>('OfferRepository').to(OfferRepositoryImpl).inSingletonScope();

  container.bind<Application>(Application).toSelf().inSingletonScope();

  return container;
}
