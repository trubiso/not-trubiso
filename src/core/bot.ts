import { Client, Collection } from 'discord.js';
import Command from '@core/command';
import Module from '@core/module';
import fs from 'fs';
import Logger from '@core/logger';
import Handler from '@core/handler';
import ora from 'ora';
import Game from './game';

export default class Bot {
  public commands: Collection<string, Command>;
  public categories: Module[];
  public prefix: string;
  public client: Client;
  public logger: Logger;
  public games: Game[];
  private handler: Handler;
  private isDev: boolean;

  public loadModule(file: string, progress?: ora.Ora) {
    const moduleName = file.slice(0, -3);
    try {
      if (progress) progress.text = `Loading module ${moduleName}...`;
      const category = require(`../categories/${file}`) as Module;
      const commandFiles = fs.readdirSync(`./commands/${category.name}`).filter((file: string) => file.endsWith('.js'));
      const categoryCommands = [];

      for (const cmdFile of commandFiles) {
        const command = require(`../commands/${category.name}/${cmdFile}`) as Command;
        this.commands.set(command.name, command);
        categoryCommands.push(command);
      }

      this.categories.push({
        name: moduleName,
        help: category.help,
        commands: categoryCommands
      } as Module);
    } catch (e) {
      throw `Couldn't load module ${file}. ${e}`;
    }
  }

  constructor(prefix: string, isDev = false) {
    this.commands = new Collection();
    this.categories = [];
    this.prefix = prefix;
    this.isDev = isDev;
    this.client = new Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'],
      allowedMentions: { repliedUser: false }
    });
    this.games = [];
    this.handler = new Handler(this);
    this.logger = new Logger(this);
  }

  public start(token: string) {
    this.logger.log('Starting bot!');

    const progress = this.logger.startSpinner('Loading modules...', 'bouncingBall');
    const categoryFiles = fs.readdirSync('./categories').filter((file: string) => file.endsWith('.js'));
    categoryFiles.forEach(file => this.loadModule(file, progress));
    progress.succeed(`Loaded ${categoryFiles.length} modules!`);

    this.client.on('ready', () => this.handler.$ready(this.isDev));
    this.client.on('messageCreate', msg => this.handler.$messageCreate(msg));
    this.client.on('error', error => this.logger.logError(error));
    process.on('unhandledRejection', error => this.logger.logError(error));

    this.client.login(token);
  }
}
