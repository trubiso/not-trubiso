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
  Red = 'redde',
  Yellow = 'yelo',
  Green = 'grin',
  Blue = 'bleu',
  Wild = 'WAILDE !!'
}

function getColor(card: UnoCard) {
  if (card.startsWith('r')) return UnoColor.Red;
  if (card.startsWith('y')) return UnoColor.Yellow;
  if (card.startsWith('g')) return UnoColor.Green;
  if (card.startsWith('b')) return UnoColor.Blue;

  return UnoColor.Wild;
}

enum UnoCardKind {
  N0,
  N1,
  N2,
  N3,
  N4,
  N5,
  N6,
  N7,
  N8,
  N9,
  AB,
  AR,
  AD,
  AC
}

function getKind(card: UnoCard) {
  if (card.endsWith('0')) return UnoCardKind.N0;
  if (card.endsWith('1')) return UnoCardKind.N1;
  if (card.endsWith('2')) return UnoCardKind.N2;
  if (card.endsWith('3')) return UnoCardKind.N3;
  if (card.endsWith('4')) return UnoCardKind.N4;
  if (card.endsWith('5')) return UnoCardKind.N5;
  if (card.endsWith('6')) return UnoCardKind.N6;
  if (card.endsWith('7')) return UnoCardKind.N7;
  if (card.endsWith('8')) return UnoCardKind.N8;
  if (card.endsWith('9')) return UnoCardKind.N9;
  if (card.endsWith('B')) return UnoCardKind.AB;
  if (card.endsWith('R')) return UnoCardKind.AR;
  if (card.endsWith('D')) return UnoCardKind.AD;
  if (card.endsWith('C')) return UnoCardKind.AC;

  throw 'what did you try to get a kind of lol';
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
  Cw = 'cloqwais',
  // counterclockwise
  Ccw = 'cauntarcloqwis'
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

function isValidCard(c: string): c is UnoCard {
  return (<string[]>getDeck()).includes(c);
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
  pendingUno: number | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterChooseResolve = (value: UnoColor) => {
    return;
  };

  static getMetadata(): CommandMetadata {
    return {
      name: 'uno',
      help: {
        brief: `plye a game of uno wif ur frends !! ${e.excited}`,
        usage: 'uno'
      }
    };
  }

  constructor(message: Message) {
    super(message);
    this.players = [message.author];
    message.reply(`created a partie !! ${e.glad} if u forgot da commands or da roolz for dis gaem pleez tyep "<what" ${e.angel}`);
  }

  private takeCards(amount: number) {
    const cards = this.deck.slice(0, amount);
    this.deck = this.deck.slice(amount);

    return cards;
  }

  private async $setup(data: CommandData): Promise<void> {
    if (data.content === `${data.bot.prefix}what`) {
      data.reply(`i see thou needest of mine assistanc... welle... ${e.silly}\n- if u want to join da partie ${e.party} pleez use da ${data.bot.prefix}join comande.. ${e.tongue_left}\n- if u wanna see who'ze in da prartie ${e.party} pleez use da ${data.bot.prefix}players comande...\n- UND FINALI !! ${e.shock_handless} if u want to START da gaem pleez use da ${data.bot.prefix}start comand !!! ${e.excited_jumping}\n- or if yu wana throw it all awei... jus doo ${data.bot.prefix}exit comande... ${e.sad3} ${e.cri}\n(obviusli da commandse relatinge to begining or ending parti ar onli abeliabl to whoo strated it ${e.silly})\n\nwans yu pley: to pley, pleez pres da cardse button to see ur cardze and odar peopl's card quantitye, and if it iz ur turn u can pley wan of em by typing its naem !! ${e.shock_handless} ${e.happy} ore... tyep "draw" to draw a card from da deqqe ${e.silly}\nhwen yu pley ur penultimet card, remember to tyep "uno" afterwards, otharwies yu'l get PENALIEZD if somwan pleys befor u sey it ${e.agony}\n\nhab fun !! ${e.glad}`);

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
        if (this.players.length < 2)
          await data.reply(`o mai gudnes !!! yur parti is 2 smal! !! do u think u can pley alon ${e.silly}`);

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
              await this.draw(2);
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

        // TODO: configuration (progressive/stacking rule, seven-o rule, ...)

        await this.playTurn(false);
      }
    }
  }

  private getTopDiscard() {
    return this.discard[this.discard.length - 1];
  }

  private async printInfo(played: boolean) {
    await this.channel?.send({
      content: `${played ? 'da last pleyr played ' : 'curant crard: '}**\`${this.getTopDiscard()}\`**\n\n${
        getColor(this.getTopDiscard()) === UnoColor.Wild ? `colore: ${this.color}\n` : ''
      }direqtion: ${this.direction}\nturne: ${this.players[this.turn]}\n\n`,
      components: [
        new MessageActionRow().addComponents([
          new MessageButton().setCustomId('uno_U_c').setLabel('cardse').setStyle('PRIMARY')
        ])
      ]
    });
  }

  private async playTurn(played: boolean) {
    await this.printInfo(played);
  }

  private async chooseColorModal(player = this.turn): Promise<UnoColor> {
    this.choosingColor = true;
    await this.channel?.send({
      content: `choos a color !! ${this.players[player]}`,
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

  private nextPlayer(q = 1) {
    let t = this.turn;
    if ((q < 0 && this.direction === Direction.Ccw) || this.direction === Direction.Cw) {
      t += q;
      while (t >= this.players.length) t -= this.players.length;
    } else {
      t -= q;
      while (t < 0) t += this.players.length;
    }

    return t;
  }

  private nextTurn() {
    this.turn = this.nextPlayer();
  }

  private async draw(amount: number, player = this.turn) {
    if (this.deck.length < amount) {
      const topDiscard = this.getTopDiscard();
      const restOfDiscard = this.discard.slice(0, -1);
      this.discard = [topDiscard];
      this.deck = shuffle([...this.deck, ...restOfDiscard]);
    }

    const cards = this.takeCards(amount);
    this.hands[player].push(...cards);

    this.channel?.send(`${this.players[player]} drawze ${amount} card${amount !== 1 ? 'sies' : ''}!!! ${e.shock_handless}${
      e.shock_handless
    }${e.shock_handless}`);
  }

  private getPlayerById(id: string) {
    return this.players.findIndex(v => v.id === id);
  }

  private getCardValidity(card: UnoCard) {
    return (
      getColor(card) === UnoColor.Wild ||
      getColor(card) === this.color ||
      getKind(card) === getKind(this.getTopDiscard())
    );
  }

  private canPlay(player = this.turn) {
    return this.hands[player].some(v => this.getCardValidity(v));
  }

  private async punishUno() {
    const uno = this.pendingUno;
    this.pendingUno = undefined;

    await this.channel?.send(`${e.silly} ${this.players[uno!]} did not sey UNOE !! he gets PUNIHSD nou !! ${e.funny}`);
    await this.draw(2, uno);
  }

  private formatCard(c: string) {
    try {
      const d = c.trim();

      return d[0].toLowerCase() + d[1].toUpperCase();
    } catch (e) {
      return c;
    }
  }

  public async $message(data: CommandData): Promise<void> {
    if (!this.playing) return await this.$setup(data);
    if (this.choosingColor) return;
    const replyingPlayer = this.getPlayerById(data.author.id);
    if (data.content.trim().toLowerCase() === 'uno')
      if (replyingPlayer === this.pendingUno) {
        this.pendingUno = undefined;
        await data.reply(`${e.coolwoah} ${e.coolwoah} ${e.coolwoah} ${e.coolwoah}`);
      }

    if (replyingPlayer === this.turn) {
      let supposedCard = data.content.trim();
      if (supposedCard === 'draw') {
        const couldPlay = this.canPlay();

        if (this.pendingUno !== undefined) await this.punishUno();

        await this.draw(1);

        if (!this.canPlay()) {
          data.reply(`unfortunetli u can't pley ENI of da cardz u drew ${e.funny} LOZAR !!! ${e.silly} ${e.silly}`);
          await this.andNext(false);

          return;
        }

        if (!couldPlay)
          data.reply(`oke u can pley ur drawne \`${this.hands[this.turn][this.hands[this.turn].length - 1]}\` nau ${e.whistling}`);
        else data.reply(`oke u can pley ur drawne carde nau ${e.whistling}`);
      }

      if (supposedCard.length !== 2) return;
      supposedCard = this.formatCard(supposedCard);

      if (!isValidCard(supposedCard)) return;

      const cardIndex = this.hands[this.turn].findIndex(v => v === supposedCard);

      if (cardIndex < 0) {
        data.reply(`u don hab dat card ${e.funny}`);

        return;
      }

      if (!this.getCardValidity(supposedCard)) {
        data.reply(`u cant pley dat card, sutpid ${e.s_facepalm}`);

        return;
      }

      // we can finally play the card
      if (this.pendingUno !== undefined) await this.punishUno();
      this.hands[this.turn].splice(cardIndex, 1);
      this.discard.push(supposedCard);
      this.color = getColor(supposedCard);
      if (this.hands[this.turn].length === 1) this.pendingUno = this.turn;

      if (this.hands[this.turn].length === 0) {
        data.reply(`${this.players[this.turn]} WONE !!! ${e.excited} ${e.party} ${e.glad} ${e.silly}`);
        data.reply(`heer's da cardze:\n\n${this.players
          .map((v, i) =>
            `${v}${
              i === this.turn
                ? ` (haz no cards becuz they'r da WINAR !! ${e.flush_happy})`
                : `: ${this.hands[i].map(v => `\`${v}\``).join(' ')}`
            }`)
          .join('\n')}\n\n**gz ${this.players[this.turn]}!! ${e.excited_jumping} ${e.party}**`);

        this.finish(data.bot);
        
        return;
      }

      if (isActionCard(supposedCard)) {
        const ogCurrent = this.turn;
        switch (actionCardKind(supposedCard)) {
        case ActionCardKind.Block:
          this.nextTurn(); // skip next person's turn
          await data.reply(`${this.players[ogCurrent]} BRUTALIE skippeded ${this.players[this.turn]}'s turne !!! ${e.coolwoah} ${
            e.excited_jumping
          } ${e.sad} ${e.funny}`);
          break;
        case ActionCardKind.Reverse:
          if (this.direction === Direction.Cw) this.direction = Direction.Ccw;
          else this.direction = Direction.Cw;
          await data.reply(`da direction haz been reversedede !! ${e.drunk} now we goin ${this.direction} ${e.silly}`);
          break;
        case ActionCardKind.Draw2:
          await data.reply(`${this.players[this.turn]} infliqts a draw carde on ${this.players[this.nextPlayer()]} !!! ${
            e.hammering
          }`);
          await this.draw(2, this.nextPlayer());
          break;
        case ActionCardKind.Draw4:
          await data.reply(`${this.players[this.turn]} infliqts a draw carde on ${this.players[this.nextPlayer()]} !!! ${
            e.hammering
          }`);
          this.color = await this.chooseColorModal();
          await this.draw(4, this.nextPlayer());
          break;
        case ActionCardKind.ChangeColor:
          await data.reply(`WHOGOGOGO !! ${e.coolwoah} da color is CHENGING !! ${e.angry_pink} ${e.glad} ${e.greneblogie} ${e.business} ${e.party}`);
          this.color = await this.chooseColorModal();
          break;
        }
      }

      await this.andNext();
    }
  }

  private async andNext(played = true) {
    this.nextTurn();
    this.playTurn(played);
  }

  public async $button(data: ButtonInteraction & { bot: Bot }) {
    const replyingPlayer = this.getPlayerById(data.user.id);

    if (data.customId.startsWith('uno_U')) {
      if (data.customId === 'uno_U_c')
        data.reply({
          content: `${this.players
            .map((v, i) =>
              `${v}${i === replyingPlayer ? ' (u)' : ''}${
                i === this.turn ? (i === replyingPlayer ? ' (ur turn)' : ' (ther turn)') : ''
              }: ${
                i === replyingPlayer
                  ? this.hands[i].map(v => (this.getCardValidity(v) ? `__**\`${v}\`**__` : `\`${v}\``)).join(' ')
                  : `\`??\`x${this.hands[i].length}`
              }`)
            .join('\n')}${
            this.turn === replyingPlayer
              ? `\n\npley ur card by tipyng its nam, or tyep "draw" to draw a card from da deqqe${
                !this.canPlay() ? '\n**u hab 2 drau a card, non of ur cards r pleyable**' : ''
              }`
              : ''
          }`,
          ephemeral: true
        });

      return;
    }

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

      if (intendedPlayer !== replyingPlayer) {
        await data.reply({ content: `not ur turn to choos color dumbut ${e.silly}`, ephemeral: true });

        return;
      }

      this.choosingColor = false;

      await data.update({
        content: `${this.players[intendedPlayer]} has choozen ${data.component.label} ${e.excited}`,
        components: []
      });

      this.afterChooseResolve(color);
    }
  }
}
