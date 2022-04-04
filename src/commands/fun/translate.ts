import Command from '@core/command';
import { smilieEnglish } from '@core/utils';
import { Util } from 'discord.js';

export = {
  name: 'translate',
  help: {
    brief: 'translatese to smili englisheshe usinge an algroithm !',
    usage: '<text>',
    examples: ['From Wikipedia, the free encyclopedia', 'This is very formal text', 'hee hee !']
  },
  execute(...text) {
    if (!text.length) throw 'gib me text to translat !!';

    let joinedText = text.join(' ').toLowerCase();
    joinedText = smilieEnglish(Util.cleanContent(joinedText, this.channel));
    this.reply(Util.cleanContent(joinedText, this.channel)); // clean it again just in case!
  }
} as Command;
