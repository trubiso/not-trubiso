import Command from '@core/command';
import { smilieEnglish } from '@core/utils';
import { Util } from 'discord.js';

export = {
  name: 'translate',
  help: {
    category: 'fun',
    brief: 'translatese to smili englisheshe usinge an algroithm !',
    usage: 'translate <text>'
  },
  execute(...args) {
    if (!args.length) throw 'gib me text to translat !!';

    let text = args.join(' ').toLowerCase();
    text = smilieEnglish(Util.cleanContent(text, this.channel));
    this.reply(Util.cleanContent(text, this.channel)); // clean it again just in case!
  }
} as Command;
