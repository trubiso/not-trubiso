import Command from '@core/command';
import { Util } from 'discord.js';

export = {
  name: 'say',
  help: {
    brief: 'de bot wil say watever yu wantete !',
    usage: '<text>'
  },
  execute(...text) {
    if (!text.length) throw 'gib me text to sey !!';

    const joinedText = text.join(' ');
    this.reply(Util.cleanContent(joinedText, this.channel));
  }
} as Command;
