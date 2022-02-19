import { Client, Collection, Message } from 'discord.js';
import { Command } from './command';
import { Module } from './module';
import fs from 'fs';
import { Logger } from './logger';
import { e } from './vars';

export class Bot {
    public commands: Collection<string, Command>;
    public categories: Module[];
    public prefix: string;
    public client: Client;
    private logger: Logger;

    private handleError(msg: Message, command: string, error: any) {
        if (!(error instanceof TypeError)) 
            msg.channel.send(`${e.shock_handless} ther was an eror executinge yuor comande !! ${e.sad} ${(error as any).toString()}`);
        else 
        if (this.commands.get(command)) this.logger.logError(error);
        
    }

    private async handleCommand(msg: Message) {
        const args = msg.content.slice(this.prefix.length).trim().split(/ +/);
        const command = args.shift()?.toLowerCase() ?? '';

        try {
            const actualCmd = this.commands.get(command) ?? this.commands.find(v => v.aliases?.includes(command) ?? false);
            if (actualCmd) {
                await (actualCmd.execute(msg, args, this) as Promise<unknown>)?.catch(error => {
                    this.handleError(msg, command, error);
                });
                this.logger.logCommand(msg, args, command);
            }
        } catch (error) {
            this.handleError(msg, command, error);
        }
    }

    private async handleMessageCreate(msg: Message) {
        if (!msg.mentions.everyone) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (msg.mentions.has(this.client.user!)) {
                msg.react('👋');
                msg.react(e.id(e.happy));
            }

            if (msg.content.includes('busines')) 
                msg.react(e.id(e.business));
        }
    
        // TODO: check whether there is an ongoing game in that channel; if so,
        // check whether player is in that game, if they are, let game handle, otherwise see below
        if (!msg.author.bot && msg.content.startsWith(this.prefix)) 
            await this.handleCommand(msg);
    }

    public loadModule(file: string) {
        try {
            const category = require(`../categories/${file}`) as Module;
            const commandFiles = fs.readdirSync(`./commands/${category.name}`).filter((file: string) => file.endsWith('.js'));
            const categoryCommands = [];

            for (const cmdFile of commandFiles) {
                const command = require(`../commands/${category.name}/${cmdFile}`) as Command;
                this.commands.set(command.name, command);
                categoryCommands.push(command);
            }

            this.categories.push({ name: file.slice(0, -3), help: category.help, commands: categoryCommands } as Module);
        } catch (e) {
            throw `Couldn't load module ${file}. ${e}`;
        }
    }

    constructor(prefix: string, token: string) {
        this.commands = new Collection();
        this.categories = [];
        this.prefix = prefix;
        this.client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'], allowedMentions: { repliedUser: false } });
        this.logger = new Logger(this);

        const categoryFiles = fs.readdirSync('./categories').filter((file: string) => file.endsWith('.js'));
        categoryFiles.forEach(file => this.loadModule(file));

        this.client.on('messageCreate', this.handleMessageCreate);
        process.on('unhandledRejection', this.logger.logError);

        this.client.login(token);
    }
}