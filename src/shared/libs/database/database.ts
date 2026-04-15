import mongoose from 'mongoose';
import { Logger } from '../logger/index.js';

export const DEFAULT_DB_PORT = 27017;
export const DEFAULT_DB_NAME = 'six-cities';

export function connectDatabase(
  url: string,
  logger: Logger
): Promise<typeof mongoose> {
  return mongoose.connect(url)
    .then((connection) => {
      logger.info(`Database connected: ${connection.connection.host}`);
      return connection;
    })
    .catch((error) => {
      logger.error(`Database connection failed: ${error.message}`);
      throw error;
    });
}

export function disconnectDatabase(logger: Logger): Promise<void> {
  return mongoose.disconnect()
    .then(() => {
      logger.info('Database disconnected');
    })
    .catch((error) => {
      logger.error(`Database disconnect error: ${error.message}`);
    });
}