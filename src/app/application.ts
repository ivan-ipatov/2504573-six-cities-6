import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Logger } from '../shared/libs/logger/index.js';
import { Config } from '../shared/libs/config/index.js';
import { connectDatabase } from '../shared/libs/database/database.js';

@injectable()
export class Application {
  constructor(
    @inject('Logger') private logger: Logger,
    @inject('Config') private config: Config,
  ) {}

  async init(): Promise<void> {
    await connectDatabase(this.config.databaseUrl, this.logger);
    this.logger.info('Application initialized');
    this.logger.info(`Server listening on port ${this.config.port}`);
  }
}
