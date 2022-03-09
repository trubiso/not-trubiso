import Game from '@core/game';
import { TextChannel, User, Message } from 'discord.js';

export default class TicTacToe extends Game {
  channel: TextChannel | undefined;
  opponent?: User;
  confirmed?: boolean;

  constructor(message: Message) {
    super(message.author);
    this.channel = message.channel as TextChannel;
  }
}
