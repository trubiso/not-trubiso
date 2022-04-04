import Command from '@core/command';
import { pick } from '@core/utils';
import { e, pickAnswers } from '@core/vars';

export = {
  name: 'rng',
  aliases: ['random-number'],
  help: {
    category: 'random',
    brief: 'picks numbr acording to de limits yu giv it !',
    extra: 'both min and max are included in the range, defaults are 1 and 10 respectively',
    usage: 'rng ([max]|[min] [max])'
  },
  execute(min?, max?) {
    // defaults (both parameters are optional)
    let parsedMin = 1;
    let parsedMax = 10;
    if (max) {
      // if both are given
      parsedMin = parseInt(min);
      parsedMax = parseInt(max);
    } else if (min) {
      // if only one is given then the only one given is the max (check usage)
      parsedMax = parseInt(min);
    }

    const num = Math.floor(Math.random() * (parsedMax - parsedMin + 1)) + parsedMin;

    if (isNaN(num)) throw `yu shuld giv me actual numberse ${e.think}`;

    const answer = pick(pickAnswers).replace(/{i}/g, `**${num}**`);

    return this.reply(answer);
  }
} as Command;
