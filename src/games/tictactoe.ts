import { CommandData, CommandMetadata } from '@core/command';
import Game from '@core/game';
import { customEmoteRegex, emojiRegex } from '@core/vars';
import { User, Message } from 'discord.js';

export interface IPiece {
  owner: User;
  piece: string;
}

export default class TicTacToe extends Game {
  opponent?: User;
  confirmed?: boolean;
  pieces: IPiece[];
  grid: boolean[][];

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

  constructor(message: Message) {
    super(message);
    this.pieces = this.grid = [];
    message.reply('started a game of tiq taq toe; mention someone to play with them');
  }

  public $setup(data: CommandData): void {
    if (!this.opponent) {
      if (data.mentions.users.size) {
        this.opponent = data.mentions.users.first()!;
        data.reply(`you have challenged ${this.opponent.tag} to a game of tic tac toe; choose your pieces by just sending them`);
        // TODO: shuffle challenger & opponent (karl :eyes:)
      }
    } else if (this.pieces.length !== 2) {
      const text = data.cleanContent;
      if (emojiRegex.test(text) || customEmoteRegex.test(text))
        if (data.author.id === this.challenger.id) {
          this.pieces[0] = { owner: this.challenger, piece: text };
          data.reply('you have chosen your piece :)');
        } else if (data.author.id === this.opponent?.id) {
          this.pieces[1] = { owner: this.opponent!, piece: text };
          data.reply('you have chosen your piece :)');
        }
    }
  }

  public $message(data: CommandData): void {
    if (!this.opponent || this.pieces.length !== 2) return this.$setup(data);
    data.reply('you have already chosen your pieces, the game should be played now :)');
  }
}
