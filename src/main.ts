#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { CityName, PropertyType, Amenity, UserType, Offer } from './types/entities.js';

// --- Interfaces ---
export interface FileReader {
  read(): void;
}

export interface Command {
  getName(): string;
  execute(...parameters: string[]): void;
}

// --- Utils & Libs ---
export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([
        title,
        description,
        postDate,
        city,
        previewImage,
        images,
        isPremium,
        isFavorite,
        rating,
        type,
        bedrooms,
        maxGuests,
        price,
        amenities,
        author,
        commentCount,
        location
      ]) => {
        const [name, email, avatarUrl, password, userType] = author.split(';');
        const [latitude, longitude] = location.split(';');

        return {
          title,
          description,
          postDate: new Date(postDate),
          city: city as CityName,
          previewImage,
          images: images.split(';'),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number.parseFloat(rating),
          type: type as PropertyType,
          bedrooms: Number.parseInt(bedrooms, 10),
          maxGuests: Number.parseInt(maxGuests, 10),
          price: Number.parseInt(price, 10),
          amenities: amenities.split(';') as Amenity[],
          author: {
            name,
            email,
            avatarUrl,
            password,
            type: userType as UserType,
          },
          commentCount: Number.parseInt(commentCount, 10),
          location: {
            latitude: Number.parseFloat(latitude),
            longitude: Number.parseFloat(longitude),
          },
        };
      });
  }
}

// --- Commands ---
type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, 'version')
  );
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = './package.json'
  ) {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public execute(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      console.info(chalk.blue(version));
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }
}

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public execute(..._parameters: string[]): void {
    console.info(`
        ${chalk.bold('Программа для подготовки данных для REST API сервера.')}
        Пример:
            main.js --<command> [--arguments]
        Команды:
            ${chalk.green('--version')}:                   # выводит номер версии
            ${chalk.green('--help')}:                      # печатает этот текст
            ${chalk.green('--import <path>')}:             # импортирует данные из TSV
    `);
  }
}
export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;

    if (!filename) {
      console.error(chalk.red('Please provide path to file. Example: --import <path>'));
      return;
    }

    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${error.message}`));
    }
  }
}

// --- Application ---
type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.prototype.hasOwnProperty.call(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);

    if (!commandName) {
      this.getCommand(this.defaultCommand).execute();
      return;
    }

    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }

  private parseCommand(cliArguments: string[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    let currentCommand = '';

    for (const argument of cliArguments) {
      if (argument.startsWith('--')) {
        result[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && argument) {
        result[currentCommand].push(argument);
      }
    }

    return result;
  }
}

// --- Bootstrap ---
function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
