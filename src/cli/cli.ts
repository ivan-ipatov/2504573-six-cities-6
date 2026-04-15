import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { createReadStream } from 'node:fs';
import pino from 'pino';
import { OfferGenerator } from '../services/offer.service.js';
import { DataFetcherService } from '../services/data-fetcher.service.js';
import { TSVWriter } from '../services/tsv-writer.js';
import { getModelForClass } from '@typegoose/typegoose';
import { OfferEntity } from '../shared/models/index.js';
import { connectDatabase, disconnectDatabase } from '../shared/libs/database/database.js';

type ParsedOffer = {
  title: string;
  description: string;
  postDate: string;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  rooms: number;
  guests: number;
  price: number;
  facilities: string[];
  author: string;
};

export const runCLI = async (args: string[]): Promise<void> => {
  const logger = pino();

  const showHelp = () => {
    console.log(chalk.blue(`
Доступные команды:

--help                              Показать список команд
--version                           Показать версию приложения
--import <file> --database-url <url>  Импортировать данные из TSV файла в БД
--generate <n>  <url>     Сгенерировать тестовые данные
    `));
  };

  const showVersion = () => {
    const packageJSON = JSON.parse(
      fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')
    );
    console.log(chalk.green(`Версия: ${packageJSON.version}`));
  };

  const parseTSV = (content: string): ParsedOffer[] => {
    const lines = content.split('\n').filter((line) => line.trim());
    return lines.map((line) => {
      const fields = line.split('\t');
      return {
        title: fields[0] || '',
        description: fields[1] || '',
        postDate: fields[2] || new Date().toISOString(),
        city: fields[3] || 'Paris',
        previewImage: fields[4] || '',
        images: fields[5] ? fields[5].split(',') : [],
        isPremium: fields[6] === 'true',
        isFavorite: fields[7] === 'true',
        rating: parseFloat(fields[8]) || 0,
        type: fields[9] || 'apartment',
        rooms: parseInt(fields[10]) || 1,
        guests: parseInt(fields[11]) || 1,
        price: parseInt(fields[12]) || 0,
        facilities: fields[13] ? fields[13].split(',') : [],
        author: fields[14] || '',
      };
    });
  };

  const importData = async (filePath?: string, databaseUrl?: string): Promise<void> => {
    if (!filePath || !databaseUrl) {
      console.error(chalk.red('Использование: --import <file> --database-url <url>'));
      return;
    }

    logger.info(`Connecting to database ${databaseUrl}...`);

    try {
      await connectDatabase(databaseUrl, logger as any);
      logger.info('Database connected');

      const offers = await new Promise<ParsedOffer[]>((resolve, reject) => {
        const resolvedPath = path.resolve(filePath);
        const readStream = createReadStream(resolvedPath, { encoding: 'utf-8' });
        let buffer = '';

        readStream.on('data', (chunk: string) => {
          buffer += chunk;
        });

        readStream.on('end', () => {
          const parsed = parseTSV(buffer);
          resolve(parsed);
        });

        readStream.on('error', reject);
      });

      console.log(chalk.yellow(`Импорт ${offers.length} предложений...`));

      const offerModel = getModelForClass(OfferEntity);
      await offerModel.insertMany(offers);

      console.log(chalk.green(`✓ Импортировано ${offers.length} предложений в БД`));

      await disconnectDatabase(logger as any);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Ошибка импорта: ${errorMessage}`));
      throw error;
    }
  };

  const generateData = async (count?: string, filePath?: string, url?: string): Promise<void> => {
    if (!count || !filePath || !url) {
      console.error(
        chalk.red('Использование: --generate <n: число> <filepath: строка> <url: строка>')
      );
      return;
    }

    const numOffers = parseInt(count, 10);
    if (isNaN(numOffers) || numOffers <= 0) {
      console.error(chalk.red('Количество должно быть положительным числом'));
      return;
    }

    console.log(chalk.yellow(`Получение данных с сервера ${url}...`));

    const fetcher = new DataFetcherService(url);
    const mockOffers = await fetcher.fetchOffers();

    if (mockOffers.length === 0) {
      console.error(chalk.red('На сервере не найдено данных'));
      return;
    }

    console.log(chalk.cyan(`Получено ${mockOffers.length} шаблонов данных`));
    console.log(chalk.yellow(`Генерация ${numOffers} предложений...`));

    const generator = new OfferGenerator();
    const offers = generator.generateOffers(mockOffers, numOffers);

    const resolvedPath = path.resolve(filePath);
    await TSVWriter.writeToFile(resolvedPath, offers);

    console.log(chalk.green(`✓ Файл успешно создан: ${resolvedPath}`));
  };

  const parsedArgs: Record<string, string> = {};
  for (let i = 1; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      parsedArgs[args[i]] = args[i + 1];
    }
  }

  const command = args[0];

  try {
    switch (command) {
      case '--help':
        showHelp();
        break;
      case '--version':
        showVersion();
        break;
      case '--import':
        await importData(parsedArgs['--import'], parsedArgs['--database-url']);
        break;
      case '--generate':
        await generateData(parsedArgs['--generate'], parsedArgs[''], parsedArgs['<url>']);
        break;
      default:
        showHelp();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Критическая ошибка: ${errorMessage}`));
    throw new Error(errorMessage);
  }
};