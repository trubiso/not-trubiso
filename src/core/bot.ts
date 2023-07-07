import Command, { CommandData } from '@core/command';
import Game from '@core/game';
import Handler from '@core/handler';
import Logger from '@core/logger';
import Module from '@core/module';
import { Client, Collection } from 'discord.js';
import fs from 'fs';
import ora from 'ora';

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
      const category = require(`../commands/${file}`) as Module;
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

  public loadGame(file: string) {
    const LoadedGame = require(`../games/${file}`).default;
    const metadata = LoadedGame.getMetadata();
    function execute(this: CommandData) {
      this.bot.games.push(new LoadedGame(this));
    }
    this.commands.set(metadata.name, {
      name: metadata.name,
      aliases: metadata.aliases,
      help: metadata.help,
      execute
    });
  }

  constructor(prefix: string, isDev = false) {
    this.commands = new Collection();
    this.categories = [];
    this.prefix = prefix;
    this.isDev = isDev;
    this.client = new Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS']
    });
    this.games = [];
    this.handler = new Handler(this);
    this.logger = new Logger(this);
  }

  public start(token: string) {
    this.logger.log('Starting bot!');

    const progress = this.logger.startSpinner('Loading modules...', 'bouncingBall');
    const categoryFiles = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js'));
    categoryFiles.forEach(file => this.loadModule(file, progress));
    progress.succeed(`Loaded ${categoryFiles.length} modules!`);

    const gameFiles = fs.readdirSync('./games').filter((file: string) => file.endsWith('.js'));
    gameFiles.forEach(file => this.loadGame(file));
    this.logger.log(`Loaded ${gameFiles.length} games!`);

    this.client.on('ready', () => this.handler.$ready(this.isDev));
    this.client.on('messageCreate', msg => this.handler.$messageCreate(msg));
    this.client.on('error', error => this.logger.logError(error));
    this.client.on('interactionCreate', interaction => this.handler.$interaction(interaction));
    this.client.on('guildMemberAdd', member => this.handler.$guildMemberAdd(member));
    process.on('unhandledRejection', error => this.logger.logError(error));

    this.client.login(token);
  }
}
