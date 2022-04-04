import Command from '@core/command';
import { pick } from '@core/utils';
import { e, pickAnswers } from '@core/vars';

export = {
  name: 'rng',
  aliases: ['random-number'],
  help: {
    category: 'random',
    brief: 'picks numbr acording to de limits yu giv it !',
    usage: 'rng <max|min, max>'
  },
  execute(...args) {
    const min = parseInt((args[1] ? args[0] : 1) as string);
    const max = parseInt(args[1] ?? args[0] ?? 10) + 1; // wth
    const num = Math.floor(Math.random() * (max - min)) + min;
    if (args.length > 2) throw 'yu gaev me too meny arguments !!';

    if (isNaN(num)) throw `yu shuld giv me actual numberse ${e.think}`;

    const answer = pick(pickAnswers).replace(/{i}/g, `**${num}**`);

    return this.reply(answer);
  }
} as Command;
