import { User, Message, MessageActionRow, MessageButton, MessageActionRowComponent } from 'discord.js';
import { CommandData, CommandMetadata } from '@core/command';
import Game from '@core/game';
import { customEmoteRegex, e, emojiRegex } from '@core/vars';

export interface IPiece {
  owner: User;
  piece: string;
}

export default class TicTacToe extends Game {
  opponent?: User;
  confirmed?: boolean;
  pieces: IPiece[];
  grid: (boolean | null)[][];
  playing = false;

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
    this.pieces = [];
    this.grid = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    message.reply('started a game of tiq taq toe; mention someone to play with them');
  }

  private getComponents(): MessageActionRow[] {
    const rows: MessageActionRow[] = [];

    this.grid.forEach((v, i) => {
      const components: MessageActionRowComponent[] = [];
      v.forEach((w, j) => {
        components.push(new MessageButton()
          .setCustomId(`tictactoe_${i * 3 + j}`)
          .setEmoji(w === null ? e.blank : this.pieces[Number(w!)].piece).setStyle(w === null ? 'PRIMARY' : 'SECONDARY'));
      });
      rows.push(new MessageActionRow().addComponents(components));
    });

    return rows;
  }

  private async sendGameMessage(): Promise<void> {
    this.channel!.send({ components: this.getComponents() });
  }

  private async $setup(data: CommandData): Promise<void> {
    if (!this.opponent) {
      if (data.mentions.users.size) {
        this.opponent = data.mentions.users.first()!;
        data.reply(`you have challenged ${this.opponent.toString()} to a game of tic tac toe; choose your pieces by just sending them`);
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
    if (this.opponent && this.pieces.length === 2) {
      this.playing = true;
      await this.sendGameMessage();
    }
  }

  public async $message(data: CommandData): Promise<void> {
    if (!this.opponent || this.pieces.length !== 2) return await this.$setup(data);
  }
}
