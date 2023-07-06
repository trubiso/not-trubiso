import Bot from '@core/bot';
import { CommandData, CommandMetadata } from '@core/command';
import Game from '@core/game';
import { e } from '@core/vars';
import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  // MessageActionRowComponent,
  // MessageButton,
  User
} from 'discord.js';

export default class Uno extends Game {
  players: User[];
  playing = false;
  turn = false;
  message: Message | undefined;
  hasChosenPiece: boolean[] = [false, false];
  wantsAllMessages = true;
  
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
      data.reply(`heer ar da pleyrs in da gaem curentli ${e.ski}\n- (HOSTE !! ${e.shock_handless}) ${this.challenger.username}\n${this.players.slice(1).map(v => `- ${v.username}`).join('\n')}`);
      
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
      }
    }
  }
  
  public async $message(data: CommandData): Promise<void> {
    if (!this.playing) return await this.$setup(data);
  }
  
  public async $button(data: ButtonInteraction & { bot: Bot }) {
    throw `Hwæt!? ${data}`;
  }
}
