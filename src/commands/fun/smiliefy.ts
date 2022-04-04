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
  execute(...text) {
    if (!text.length) throw 'giv me text to smiliefie';

    let emojis: string[] | undefined;
    if (!(emojis = this.guild?.emojis.cache.map(v => v.toString())))
      throw `i can't access the guild's emojis ${e.think}`;

    const getRandomEmote = (): string => pick(emojis);

    const addRandomEmotes = (text: string): string => applyPerWord(v => `${v} ${getRandomEmote()}`, text);

    let joinedText = Util.cleanContent(text
      .join(' ')
      .replace(/--times [0-9]+/g, '') // remove the --times argument; it is irrelevant currently
      .trim(),
    this.channel);

    let rawNumber = parseInt(text.at(-1) ?? '1'); // get the number of times to smiliefy
    if (isNaN(rawNumber)) rawNumber = 1; // if the number is not a number, set it to 1
    const number = clamp(rawNumber, 1, 5);

    repeat(() => {
      joinedText = addRandomEmotes(joinedText);
    }, number);

    if (joinedText.length > 4000) throw `yur text is too bigege !! ${e.sad}`;
    else return this.reply(joinedText);
  }
} as Command;
