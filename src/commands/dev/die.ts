import Command from '@core/command';
import { e } from '@core/vars';

export = {
  name: 'die',
  help: {
    brief: 'i wil stop runing'
  },
  async execute() {
    await this.reply(`i shal returne! ${e.salute}`);
    await this.bot.client.destroy();
  }
} as Command;
