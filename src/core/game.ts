import Bot from '@core/bot';
import { CommandData, CommandMetadata } from '@core/command';
import { ButtonInteraction, Message, SelectMenuInteraction, TextChannel, User } from 'discord.js';

export default class Game {
  public channel: TextChannel | undefined;
  public challenger: User;
  public opponent?: User;
  public confirmed?: boolean;
  public wantsAllMessages = false;

  static getMetadata(): CommandMetadata {
    return {
      name: '',
      help: {
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
  public $button?(data: ButtonInteraction & { bot: Bot }): void;
  public $selectMenu?(data: SelectMenuInteraction & { bot: Bot }): void;

  protected async finish(bot: Bot) {
    bot.games = bot.games.filter(v => !(
      v.channel === this.channel &&
      v.challenger === this.challenger &&
      v.opponent === this.opponent &&
      typeof v === typeof this));
    this.destroy(bot);
  }
}
