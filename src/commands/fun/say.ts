import Command from '@core/command';
import { Util } from 'discord.js';

export = {
  name: 'say',
  help: {
    category: 'fun',
    brief: 'de bot wil say watever yu wantete !',
    usage: 'say <text>'
  },
  execute(...args) {
    if (!args.length) throw 'gib me text to sey !!';

    const text = args.join(' ');
    this.reply(Util.cleanContent(text, this.channel));
  }
} as Command;
