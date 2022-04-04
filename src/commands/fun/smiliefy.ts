import Command from '@core/command';
import { e } from '@core/vars';
import { applyPerWord, clamp, pick, repeat } from '@core/utils';
import { Util } from 'discord.js';

export = {
  name: 'smiliefy',
  help: {
    category: 'fun',
    brief: 'smiliefies yuor texte',
    usage: '<text> [--times [amount]]',
    extra: 'smiliefy amount is clamped between 1 and 5'
  },
  execute(...args) {
    if (!args.length) throw 'giv me text to smiliefie';

    let emojis: string[] | undefined;
    if (!(emojis = this.guild?.emojis.cache.map(v => v.toString())))
      throw `i can't access the guild's emojis ${e.think}`;

    const getRandomEmote = (): string => pick(emojis);

    const addRandomEmotes = (text: string): string => applyPerWord(v => `${v} ${getRandomEmote()}`, text);

    let text = Util.cleanContent(args
      .join(' ')
      .replace(/--times [0-9]+/g, '') // remove the --times argument; it is irrelevant currently
      .trim(),
    this.channel);

    let rawNumber = parseInt(args.at(-1) ?? '1');
    if (isNaN(rawNumber)) rawNumber = 1;
    const number = clamp(rawNumber, 1, 5);

    repeat(() => {
      text = addRandomEmotes(text);
    }, number);

    if (text.length > 4000) throw `yur text is too bigege !! ${e.sad}`;
    else return this.reply(text);
  }
} as Command;
