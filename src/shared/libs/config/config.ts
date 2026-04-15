import convict from 'convict';
import { Config } from './config.interface.js';

export function loadConfig(): Config {
  const config = convict<Config>({
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 4000,
      env: 'PORT',
    },
    databaseUrl: {
      doc: 'The data base server address (valid IP or URL).',
      format: (val: string) => {
        const ipRegex = /^(mongodb:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,5}\/\w+$/;
        if (!ipRegex.test(val)) {
          throw new Error('Invalid database URL format. Expected: mongodb://IP:port/database');
        }
      },
      default: 'mongodb://127.0.0.1:27017/six-cities',
      env: 'DATABASE_URL',
    },
    salt: {
      doc: 'Salt for password hashing.',
      format: String,
      default: '',
      env: 'SALT',
    },
  });

  config.load({});

  config.validate({ allowed: 'strict' });

  return config.getProperties();
}
