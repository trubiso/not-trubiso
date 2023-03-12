import Command from '@core/command';
import { e } from '@core/vars';

export = {
  name: 'die',
  help: {
    brief: 'i wil stop runing'
  },
  execute() {
    this.reply(`i shal returne! ${e.salute}`);
    this.bot.client.destroy();
  }
} as Command;
