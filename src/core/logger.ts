import { Message } from 'discord.js';
import { Bot } from './bot';
import chalk from 'chalk';

export class Logger {
    private bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    public logCommand(msg: Message, args: string[], command: string) : void {
        const commandExists = this.bot.commands.get(command);
        const alias = this.bot.commands.find(v => v.aliases?.includes(command) ?? false);
        const isAlias = !commandExists && alias;
        const commandName = commandExists?.name ?? alias?.name ?? 'undefined';
        console.log(`\
            ${chalk.bgGrey('[LOG]')} \
            ${chalk.grey(`${msg.author.username}#${msg.author.discriminator} used \
            ${this.bot.prefix}${alias ? alias : commandName}${isAlias ? ` (Alias of ${commandName})` : ''}\
            ${args.length ? `(Arguments: ${args.join(' ')})` : '(No arguments)'}`)}\
        `);
    }

    public logError(error: any) : void {
        console.error(`${chalk.red('[ERROR]')} ${chalk.redBright(error.toString())} ${(error as Error).stack}`);
    }
}