import Command from '@core/command';
import { clamp, pick } from '@core/utils';

export = {
  name: 'randomemote',
  aliases: ['re'],
  help: {
    category: 'random',
    brief: 'sends a random emot for yu !',
    usage: 'randomemote [num (up to 5)]'
  },
  execute(...args) {
    const num = clamp(args[0] ? parseInt(args[0]) : 1, 1, 5);
    const arr = this.guild?.emojis.cache.map(v => v.toString()) ?? [];
    const emojis: string[] = [];

    [...Array(num).keys()].forEach(() => {
      emojis.push(pick(arr));
    });

    this.reply(emojis.join(''));
  }
} as Command;
