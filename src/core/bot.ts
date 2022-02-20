import { Client, Collection } from 'discord.js';
import { Command } from './command';
import { Module } from './module';
import fs from 'fs';
import { Logger } from './logger';
import { Handler } from './handler';

export class Bot {
    public commands: Collection<string, Command>;
    public categories: Module[];
    public prefix: string;
    public client: Client;
    public logger: Logger;
    private handler: Handler;

    public loadModule(file: string) {
        try {
            const category = require(`../categories/${file}`) as Module;
            const commandFiles = fs
                .readdirSync(`./commands/${category.name}`)
                .filter((file: string) => file.endsWith('.js'));
            const categoryCommands = [];

            for (const cmdFile of commandFiles) {
                const command = require(`../commands/${category.name}/${cmdFile}`) as Command;
                this.commands.set(command.name, command);
                categoryCommands.push(command);
            }

            this.categories.push({
                name: file.slice(0, -3),
                help: category.help,
                commands: categoryCommands
            } as Module);
        } catch (e) {
            throw `Couldn't load module ${file}. ${e}`;
        }
    }

    constructor(prefix: string, token: string) {
        this.commands = new Collection();
        this.categories = [];
        this.prefix = prefix;
        this.client = new Client({
            intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'],
            allowedMentions: { repliedUser: false }
        });
        this.handler = new Handler(this);
        this.logger = new Logger(this);

        const categoryFiles = fs.readdirSync('./categories').filter((file: string) => file.endsWith('.js'));
        categoryFiles.forEach(file => this.loadModule(file));

        this.client.on('ready', () => this.handler.$ready());
        this.client.on('messageCreate', msg => this.handler.$messageCreate(msg));
        this.client.on('error', error => this.logger.logError(error));
        process.on('unhandledRejection', error => this.logger.logError(error));

        this.client.login(token);
    }
}
