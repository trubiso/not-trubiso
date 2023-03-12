import Command from '@core/command';
import { pick } from '@core/utils';
import { author, e, noPermissionAnswers } from '@core/vars';

export = {
  name: 'die',
  help: {
    brief: 'i wil stop runing'
  },
  async execute() {
    if (this.author.id !== author) {
      this.reply(pick(noPermissionAnswers));

      return;
    }
    await this.reply(`i shal returne! ${e.salute}`);
    await this.bot.client.destroy();
  }
} as Command;
