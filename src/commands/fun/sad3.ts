import Command from '@core/command';
import { e } from '@core/vars';

export = {
  name: 'sad3',
  aliases: [e.sad3],
  help: {
    category: 'fun',
    brief: e.sad3
  },
  execute() {
    this.reply(`i'm sade tooe... ${e.sad3}`);
  }
} as Command;
