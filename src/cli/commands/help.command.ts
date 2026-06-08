import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            ${chalk.yellow('cli.js --<command> [--arguments]')}
        Команды:
            ${chalk.yellow('--version')}                                                      ${chalk.gray('# выводит номер версии')}
            ${chalk.yellow('--help')}                                                         ${chalk.gray('# печатает этот текст')}
            ${chalk.yellow('--import <path> <user> <password> <host> <port> <db> <salt>')}    ${chalk.gray('# импортирует данные из TSV в MongoDB')}
            ${chalk.yellow('--generate <n> <path> <url>')}                                    ${chalk.gray('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
