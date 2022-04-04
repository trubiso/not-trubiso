import Command from '@core/command';
import { clamp, pick } from '@core/utils';

export = {
  name: 'randomemote',
  aliases: ['re'],
  help: {
    brief: 'sends a random emot for yu !',
    extra: 'emote amount is clamped between 1 and 5',
    usage: '[amount]'
  },
  execute(amount?) {
    const num = clamp(amount ? parseInt(amount) : 1, 1, 5);
    const arr = this.guild?.emojis.cache.map(v => v.toString()) ?? [];
    const emojis: string[] = [];

    for (let i = 0; i < num; i++) emojis.push(pick(arr));

    this.reply(emojis.join(''));
  }
} as Command;
