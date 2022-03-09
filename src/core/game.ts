import { ButtonInteraction, Message, SelectMenuInteraction, TextChannel, User } from 'discord.js';
import Bot from '@core/bot';
import { CommandData, CommandMetadata } from '@core/command';

export default class Game {
  public channel: TextChannel | undefined;
  public challenger: User;
  public opponent?: User;
  public confirmed?: boolean;

  static getMetadata(): CommandMetadata {
    return {
      name: '',
      help: {
        category: 'games',
        brief: '',
        usage: ''
      }
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(message: Message, ...args: string[]) {
    this.challenger = message.author;
    this.channel = message.channel as TextChannel;
  }

  public destroy(bot: Bot): void {
    this.channel = undefined;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.$button = this.$message = this.$selectMenu = () => {};
    // eslint-disable-next-line eqeqeq
    bot.games = bot.games.filter(v => this == v);
  }

  public $message?(data: CommandData): void;
  public $button?(data: Bot & ButtonInteraction): void;
  public $selectMenu?(data: Bot & SelectMenuInteraction): void;
}
