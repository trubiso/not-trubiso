import Command from '@core/command';
import { pick } from '@core/utils';
import { e, eightballAnswers } from '@core/vars';

export = {
  name: '8ball',
  aliases: ['eightball', '8b'],
  help: {
    brief: 'da smili gods will decied if they can agree with somthing!',
    usage: '<question>',
    examples: ['ar shoos tastie?', 'ar yu hapi?', 'ise vanila iec creem gut?'],
    extra: 'works beste wit yes/no questiones'
  },
  execute(...question) {
    if (!question.length) return this.reply(`yu hab to ask a questione! ${e.really}`);

    const answer = pick(eightballAnswers);

    return this.reply(answer);
  }
} as Command;
