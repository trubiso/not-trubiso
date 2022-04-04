import Command from '@core/command';
import { pick } from '@core/utils';
import { e, pickAnswers } from '@core/vars';
import { Util } from 'discord.js';

export = {
  name: 'pick',
  aliases: ['choose'],
  help: {
    brief: 'choosese wan element from a liste ! (usualy da best wan)',
    usage: '<element>, <element>, [element]...',
    examples: [
      'do homwork, procrastinaet',
      'rite tong, left tong, downwrads tong, upwrads tong',
      'English (UK/US), smily english !! :P, toki pona :]'
    ],
    extra: 'elemnents ar seprateded by comase, an 2 elementsese ar reqwaeieird !! (chek usag)'
  },
  execute(...elements) {
    if (!elements.length) throw 'plees, enter elements for me to choos frome !!';

    const arr = elements.join(' ').split(',');
    if (!arr[1] || !arr[0]) throw `meybi enter at least 2 elements for me to choos from ?? ${e.sad}`;

    const item = Util.cleanContent(pick(arr).trim(), this.channel);

    const answer = pick(pickAnswers).replace(/{i}/g, `**${item}**`);

    if (answer.length > 4000) throw `yur options ar too bigege !! ${e.sad}`; // which btw this case is almost impossible but you never know

    return this.reply(answer);
  }
} as Command;
