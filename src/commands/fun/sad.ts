import Command from '@core/command';
import { e } from '@core/vars';

export = {
  name: 'sad',
  aliases: [e.sad],
  help: {
    category: 'fun',
    brief: e.sad
  },
  execute() {
    this.reply(`dont be sade!!! be happi!! ${e.happy}${e.happy}${e.happy}`);
  }
} as Command;
