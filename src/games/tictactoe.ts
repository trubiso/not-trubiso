import { CommandData, CommandMetadata } from '@core/command';
import Game from '@core/game';
import { User, Message } from 'discord.js';

export default class TicTacToe extends Game {
  opponent?: User;
  confirmed?: boolean;

  static getMetadata(): CommandMetadata {
    return {
      name: 'tictactoe',
      help: {
        category: 'games',
        brief: 'Play a game of tic tac toe with your opponent.',
        usage: 'tictactoe <opponent>'
      }
    };
  }

  constructor(message: Message, ...args: string[]) {
    super(message);
    message.reply('started a game of tiq taq toe; mention someone to play with them');
  }

  public $message(data: CommandData) {
    if (!this.opponent) 
      if (data.mentions.users.size) {
        this.opponent = data.mentions.users.first()!;
        data.reply(`you have challenged ${this.opponent.tag} to a game of tic tac toe`);
      }
    
  }
}
