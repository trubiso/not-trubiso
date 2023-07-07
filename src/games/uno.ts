import Bot from '@core/bot';
import { CommandData, CommandMetadata } from '@core/command';
import Game from '@core/game';
import { shuffle } from '@core/utils';
import { e } from '@core/vars';
import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  // MessageActionRowComponent,
  // MessageButton,
  User
} from 'discord.js';

enum UnoCard {
  r0 = 'r0',
  r1 = 'r1',
  r2 = 'r2',
  r3 = 'r3',
  r4 = 'r4',
  r5 = 'r5',
  r6 = 'r6',
  r7 = 'r7',
  r8 = 'r8',
  r9 = 'r9',
  rB = 'rB', // block
  rR = 'rR', // rev
  rD = 'rD', // draw
  y0 = 'y0',
  y1 = 'y1',
  y2 = 'y2',
  y3 = 'y3',
  y4 = 'y4',
  y5 = 'y5',
  y6 = 'y6',
  y7 = 'y7',
  y8 = 'y8',
  y9 = 'y9',
  yB = 'yB', // block
  yR = 'yR', // rev
  yD = 'yD', // draw
  g0 = 'g0',
  g1 = 'g1',
  g2 = 'g2',
  g3 = 'g3',
  g4 = 'g4',
  g5 = 'g5',
  g6 = 'g6',
  g7 = 'g7',
  g8 = 'g8',
  g9 = 'g9',
  gB = 'gB', // block
  gR = 'gR', // rev
  gD = 'gD', // draw
  b0 = 'b0',
  b1 = 'b1',
  b2 = 'b2',
  b3 = 'b3',
  b4 = 'b4',
  b5 = 'b5',
  b6 = 'b6',
  b7 = 'b7',
  b8 = 'b8',
  b9 = 'b9',
  bB = 'bB', // block
  bR = 'bR', // rev
  bD = 'bD', // draw
  wD = 'wD', // wild draw 4
  wC = 'wC' // wild change color
}

enum UnoColor {
  Red,
  Yellow,
  Green,
  Blue,
  Wild
}

function getColor(card: UnoCard) {
  if (card.startsWith('r')) return UnoColor.Red;
  if (card.startsWith('y')) return UnoColor.Yellow;
  if (card.startsWith('g')) return UnoColor.Green;
  if (card.startsWith('b')) return UnoColor.Blue;

  return UnoColor.Wild;
}

enum ActionCardKind {
  Block,
  Reverse,
  Draw2,
  Draw4,
  ChangeColor
}

function isActionCard(card: UnoCard) {
  switch (card) {
  case 'rB':
  case 'rR':
  case 'rD':
  case 'yB':
  case 'yR':
  case 'yD':
  case 'gB':
  case 'gR':
  case 'gD':
  case 'bB':
  case 'bR':
  case 'bD':
  case 'wD':
  case 'wC':
    return true;
  }

  return false;
}

function actionCardKind(card: UnoCard) {
  switch (card) {
  case 'rB':
  case 'yB':
  case 'gB':
  case 'bB':
    return ActionCardKind.Block;
  case 'rR':
  case 'yR':
  case 'gR':
  case 'bR':
    return ActionCardKind.Reverse;
  case 'rD':
  case 'yD':
  case 'gD':
  case 'bD':
    return ActionCardKind.Draw2;
  case 'wD':
    return ActionCardKind.Draw4;
  case 'wC':
    return ActionCardKind.ChangeColor;
  }
  throw 'not an action card';
}

enum Direction {
  // clockwise
  Cw,
  // counterclockwise
  Ccw
}

// 1 of 0 and 2 of 1-9 + R + B + D for each color, 4 of each wild.
function getDeck() {
  return [
    'r0',
    'r1',
    'r2',
    'r3',
    'r4',
    'r5',
    'r6',
    'r7',
    'r8',
    'r9',
    'rB',
    'rR',
    'rD',
    'r1',
    'r2',
    'r3',
    'r4',
    'r5',
    'r6',
    'r7',
    'r8',
    'r9',
    'rB',
    'rR',
    'rD',
    'y0',
    'y1',
    'y2',
    'y3',
    'y4',
    'y5',
    'y6',
    'y7',
    'y8',
    'y9',
    'yB',
    'yR',
    'yD',
    'y1',
    'y2',
    'y3',
    'y4',
    'y5',
    'y6',
    'y7',
    'y8',
    'y9',
    'yB',
    'yR',
    'yD',
    'g0',
    'g1',
    'g2',
    'g3',
    'g4',
    'g5',
    'g6',
    'g7',
    'g8',
    'g9',
    'gB',
    'gR',
    'gD',
    'g1',
    'g2',
    'g3',
    'g4',
    'g5',
    'g6',
    'g7',
    'g8',
    'g9',
    'gB',
    'gR',
    'gD',
    'b0',
    'b1',
    'b2',
    'b3',
    'b4',
    'b5',
    'b6',
    'b7',
    'b8',
    'b9',
    'bB',
    'bR',
    'bD',
    'b1',
    'b2',
    'b3',
    'b4',
    'b5',
    'b6',
    'b7',
    'b8',
    'b9',
    'bB',
    'bR',
    'bD',
    'wD',
    'wD',
    'wD',
    'wD',
    'wC',
    'wC',
    'wC',
    'wC'
  ] as UnoCard[];
}

export default class Uno extends Game {
  players: User[];
  playing = false;
  message: Message | undefined;
  wantsAllMessages = true;

  deck: UnoCard[] = [];
  discard: UnoCard[] = [];
  hands: UnoCard[][] = [];
  turn = 0;
  direction = Direction.Cw;
  color = UnoColor.Wild;
  choosingColor = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterChooseResolve = (value: UnoColor) => {
    return;
  };

  static getMetadata(): CommandMetadata {
    return {
      name: 'secret',
      help: {
        brief: 'Play a game of secret.',
        usage: 'secret'
      }
    };
  }

  constructor(message: Message) {
    super(message);
    this.players = [message.author];
    message.reply(`created a partie !! ${e.glad} if u forgot da commands for dis gaem pleez tyep "<what" ${e.angel}`);
  }

  private getComponents(): MessageActionRow[] {
    return [];
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

  private takeCards(amount: number) {
    const cards = this.deck.slice(0, amount);
    this.deck = this.deck.slice(amount);

    return cards;
  }

  private async $setup(data: CommandData): Promise<void> {
    if (data.content === `${data.bot.prefix}what`) {
      data.reply(`i see thou needest of mine assistanc... welle... ${e.silly}\n- if u want to join da partie ${e.party} pleez use da ${data.bot.prefix}join comande.. ${e.tongue_left}\n- if u wanna see who'ze in da prartie ${e.party} pleez use da ${data.bot.prefix}players comande...\n- UND FINALI !! ${e.shock_handless} if u want to START da gaem pleez use da ${data.bot.prefix}start comand !!! ${e.excited_jumping}\n- or if yu wana throw it all awei... jus doo ${data.bot.prefix}exit comande... ${e.sad3} ${e.cri}\n(obviusli da commandse relatinge to begining or ending parti ar onli abeliabl to whoo strated it ${e.silly})\n\nhab fun !! ${e.glad}`);

      return;
    }

    if (data.content === `${data.bot.prefix}join`) {
      if (this.players.map(v => v.id).includes(data.author.id)) {
        data.reply(`u alredi joind da gaem... ${e.s_facepalm}`);
      } else {
        this.players.push(data.author);
        data.reply(`joind gaem !! wlelcom !! 👋${e.happy} ${e.excited} ${e.excited_jumping}`);
      }

      return;
    }

    if (data.content === `${data.bot.prefix}players`) {
      data.reply(`heer ar da pleyrs in da gaem curentli ${e.ski}\n- (HOSTE !! ${e.shock_handless}) ${
        this.challenger.username
      }\n${this.players
        .slice(1)
        .map(v => `- ${v.username}`)
        .join('\n')}`);

      return;
    }

    const isStart = data.content === `${data.bot.prefix}start`;
    const isExit = data.content === `${data.bot.prefix}exit`;
    if (isStart || isExit) {
      if (data.author.id !== this.challenger.id) {
        data.reply(`who u think u ar !? ${e.angry_pink} onli da hoste can control deez kinds of tings yu donkee ${e.tribaldance} ${e.sad}`);

        return;
      }

      if (isExit) {
        data.reply(`bye thene ${e.sad2} ${e.cri2} at leest thenk mi ${e.cri}`);

        this.finish(data.bot);

        return;
      }

      if (isStart) {
        data.reply(`YEASEE !!! ${e.excited} STARTARTIARIGNINIGN !!! ${e.excited_jumping} ${e.party} ${e.flush_happy}`);
        this.playing = true;

        // shuffle the players
        this.players = shuffle(this.players);

        // now player 0 is a dealer
        // prepare deck
        this.deck = getDeck();
        this.deck = shuffle(this.deck);

        // rules come from https://en.wikipedia.org/wiki/Uno_(card_game)

        // To start a hand, seven cards are dealt to each player,
        // (no for-of loop because we don't care about the player in question)
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.players.length; i++) {
          // get 7 cards
          const hand = this.takeCards(7);

          // assign them to the player
          this.hands.push(hand);
        }

        // reset turn, direction, color
        this.turn = this.players.length - 1;
        this.direction = Direction.Cw;
        this.color = UnoColor.Wild;

        // and the top card of the remaining deck is flipped over and set aside to begin the discard pile.
        this.discard = [this.deck[0]];
        this.deck = this.deck.slice(1);
        this.color = getColor(this.discard[0]);

        // The player to the dealer's left plays first unless the first card on the discard pile is an action or Wild card (see below)
        let finishedDetermining = false;
        while (!finishedDetermining) {
          finishedDetermining = true;
          if (isActionCard(this.discard[0]))
            switch (actionCardKind(this.discard[0])) {
            case ActionCardKind.Block:
              // Player to dealer's left misses a turn
              this.nextTurn();
              break;
            case ActionCardKind.Reverse:
              // Dealer plays first; play proceeds counterclockwise
              this.nextTurn();
              this.direction = Direction.Ccw;
              break;
            case ActionCardKind.Draw2:
              // Player to dealer's left draws two cards and misses a turn
              this.draw(2);
              this.nextTurn();
              break;
            case ActionCardKind.Draw4:
              // Card is returned to the deck,
              this.deck.push(this.discard[0]);
              this.discard = [];
              // then a new card is laid down into the discard pile (deck may be reshuffled first if needed)
              this.deck = shuffle(this.deck);
              this.discard = [this.deck[0]];
              this.deck = this.deck.slice(1);
              finishedDetermining = false;
              break;
            case ActionCardKind.ChangeColor:
              // Player to dealer's left declares the first color to be matched and takes the first turn
              this.color = await this.chooseColorModal();
            }
        }

        data.reply('TODO: configuration (0-7 rule, etc)');

        console.log(this.deck);
        console.log(this.discard);
        console.log(this.hands);
        console.log(this.turn);
        console.log(this.direction);
        console.log(this.color);
      }
    }
  }

  private async chooseColorModal(player = this.turn): Promise<UnoColor> {
    this.choosingColor = true;
    await this.channel?.send({
      content: `choos a color !! ${this.players[player].toString()}`,
      components: [
        new MessageActionRow().addComponents([
          new MessageButton().setCustomId(`uno_r${player}`).setLabel('rede').setStyle('DANGER'),
          new MessageButton().setCustomId(`uno_y${player}`).setLabel('yelo').setStyle('SECONDARY'),
          new MessageButton().setCustomId(`uno_g${player}`).setLabel('greene').setStyle('SUCCESS'),
          new MessageButton().setCustomId(`uno_b${player}`).setLabel('blu').setStyle('PRIMARY')
        ])
      ]
    });

    return await new Promise(resolve => {
      this.afterChooseResolve = resolve;
    });
  }

  private nextTurn() {
    this.turn += 1;
    while (this.turn >= this.players.length) this.turn -= this.players.length;
  }

  private draw(amount: number, player = this.turn) {
    if (this.deck.length < amount) throw 'TODO: fix the deck length problem';

    const cards = this.takeCards(amount);
    this.hands[player].push(...cards);
  }

  public async $message(data: CommandData): Promise<void> {
    if (!this.playing) return await this.$setup(data);
    if (this.choosingColor) return;
  }

  public async $button(data: ButtonInteraction & { bot: Bot }) {
    if (this.choosingColor) {
      let color = UnoColor.Red;
      switch (data.customId.slice(0, 5)) {
      case 'uno_r':
        color = UnoColor.Red;
        break;
      case 'uno_y':
        color = UnoColor.Yellow;
        break;
      case 'uno_g':
        color = UnoColor.Green;
        break;
      case 'uno_b':
        color = UnoColor.Blue;
        break;
      default:
        return;
      }

      const intendedPlayer = parseInt(data.customId.slice(5));
      const replyingPlayer = this.players.findIndex(v => v.id === data.user.id);

      if (intendedPlayer !== replyingPlayer) {
        await data.reply({ content: `not ur turn to choos color dumbut ${e.silly}`, ephemeral: true });

        return;
      }

      await data.update({
        content: `${this.players[intendedPlayer].toString()} has choozen ${data.component.label} ${e.excited}`,
        components: []
      });

      this.afterChooseResolve(color);
    }
  }
}
