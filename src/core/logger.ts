import { Message } from 'discord.js';
import Bot from '@core/bot';
import chalk from 'chalk';
import ora from 'ora';
import { SpinnerName } from 'cli-spinners';

export default class Logger {
    private bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    public logCommand(msg: Message, args: string[], command: string): void {
        const commandExists = this.bot.commands.get(command);
        const alias = this.bot.commands.find(v => v.aliases?.includes(command) ?? false);
        const isAlias = !commandExists && alias;
        const commandName = commandExists?.name ?? alias?.name ?? 'undefined';
        console.log(`${chalk.bgGrey('[LOG]')} ${chalk.grey(`${msg.author.username}#${msg.author.discriminator} used ${this.bot.prefix}${
            alias ? alias.name : commandName
        }${isAlias ? ` (Alias of ${commandName})` : ''} ${
            args.length ? `(Arguments: ${args.join(' ')})` : '(No arguments)'
        }`)}`);
    }

    public logError(error: any): void {
        console.error(`${chalk.red('[ERROR]')} ${chalk.redBright(error.toString())}\n${(error as Error).stack}`);
    }

    public logCritical(error: any): void {
        console.error(`${chalk.bgRed(chalk.whiteBright('[CRITICAL]'))} ${chalk.redBright(error.toString())}\n${
            (error as Error).stack
        }`);
    }

    public log(msg: any): void {
        console.log(chalk.grey(msg.toString()));
    }

    public startSpinner(text: string, spinner: SpinnerName = 'dots') {
        return ora({
            text: text,
            spinner: spinner
        });
    }
}
