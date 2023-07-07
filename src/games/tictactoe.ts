import Bot from '@core/bot';
import { CommandData, CommandMetadata } from '@core/command';
import Game from '@core/game';
import { karlgorithm, pick } from '@core/utils';
import { customEmoteRegex, e, emojiRegex } from '@core/vars';
import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageActionRowComponent,
  MessageButton,
  User
} from 'discord.js';

export interface IPiece {
  owner: User;
  piece: string;
}

export default class TicTacToe extends Game {
  opponent?: User;
  confirmed?: boolean;
  pieces: IPiece[] = [];
  grid: number[][];
  playing = false;
  turn = false;
  message: Message | undefined;
  hasChosenPiece: boolean[] = [false, false];

  static getMetadata(): CommandMetadata {
    return {
      name: 'tictactoe',
      help: {
        brief: 'Play a game of tic tac toe with your opponent.',
        usage: 'tictactoe <opponent>'
      }
    };
  }

  constructor(message: Message) {
    super(message);
    this.pieces = [];
    this.grid = [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1]
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
          .setEmoji(w === -1 ? e.blank : w === 2 ? e.greneblogie : this.pieces[w].piece)
          .setStyle(w === -1 ? 'PRIMARY' : w === 2 ? 'SUCCESS' : 'SECONDARY'));
      });
      rows.push(new MessageActionRow().addComponents(components));
    });

    return rows;
  }

  private async renewGameMessage(): Promise<void> {
    this.message = await this.channel!.send({ components: this.getComponents() });
  }

  private async editGameMessage(data?: ButtonInteraction): Promise<void> {
    if (data) await data.update({ components: this.getComponents() });
    else await this.message!.edit({ components: this.getComponents() });
  }

  private async win(data: ButtonInteraction & { bot: Bot }): Promise<void> {
    await this.editGameMessage();
    await data.reply(`YOU WON !!! ${data.user} CONGREATUTAILTAIIONS !!! ${e.excited}${e.happy}${e.flush_happy}`);
    this.finish(data.bot);
  }

  private async $setup(data: CommandData): Promise<void> {
    if (data.content === 'hocus pocus') {
      data.reply('quickstart, place as you wish');
      this.hasChosenPiece = [true, true];
      this.pieces = [
        { owner: this.challenger, piece: e.tongue_left },
        { owner: this.opponent!, piece: pick(Object.values(e).slice(0, -1)) }
      ];
    } else if (!this.opponent) {
      if (data.mentions.users.size) {
        this.opponent = data.mentions.users.first()!;
        data.reply(`you have challenged ${this.opponent} to a game of tic tac toe; choose your pieces by just sending them`);
        // TODO: shuffle challenger & opponent (karl :eyes:)
      }
    } else if (this.hasChosenPiece.some(v => !v)) {
      const text = data.cleanContent;
      const customEmoteMatch = customEmoteRegex.test(text);
      const emojiMatch = emojiRegex.test(text);
      if (customEmoteMatch || emojiMatch) {
        const match = customEmoteMatch ? customEmoteRegex : emojiRegex;
        const actualEmote = (match.exec(text) ? match.exec(text)![0] : text) ?? text;
        if (data.author.id === this.challenger.id) {
          this.pieces.push({ owner: this.challenger, piece: actualEmote });
          this.hasChosenPiece[0] = true;
          data.reply('you have chosen your piece :)');
        } else if (data.author.id === this.opponent?.id) {
          this.pieces.push({ owner: this.opponent!, piece: actualEmote });
          this.hasChosenPiece[1] = true;
          data.reply('you have chosen your piece :)');
        } else {
          throw "i received a message from a person i shouldn't have";
        }
      }
    }

    if (this.hasChosenPiece.every(v => v)) {
      this.pieces.sort((a, b) => (a.owner.id === this.challenger.id ? -1 : b.owner.id === this.challenger.id ? 1 : 0));
      this.playing = true;
      await this.renewGameMessage();
    }
  }

  public async $message(data: CommandData): Promise<void> {
    if (!this.opponent || this.pieces.length !== 2) return await this.$setup(data);
  }

  public async $button(data: ButtonInteraction & { bot: Bot }) {
    if (data.customId.startsWith('uno_')) return;
    
    if (data.user.id !== (this.turn ? this.opponent!.id : this.challenger.id))
      return data.reply({ content: 'not ur turn', ephemeral: true });

    const id = data.customId.split('_')[1];
    const parsedId = parseInt(id);
    const y = Math.floor(parsedId / 3);
    const x = parsedId % 3;

    if (this.grid[y][x] === -1) {
      const placedBy = Number(data.user.id !== this.challenger.id);
      this.grid[y][x] = placedBy;
      if (karlgorithm([y, x], placedBy, this.grid, 3, 2)) await this.win(data);
      else await this.editGameMessage(data);
    } else {
      data.reply({ content: 'that space is full', ephemeral: true });
    }

    this.turn = !this.turn;
  }
}
