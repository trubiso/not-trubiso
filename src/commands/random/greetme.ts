import Command from '@core/command';
import { smilieEnglish, getBotReadyAnswer } from '@core/utils';

export = {
  name: 'greetme',
  aliases: ['gm'],
  help: {
    brief: 'i greet u (or anoder preson !) !!!',
    usage: '[mention] [reply num]',
    examples: ['', '@tongy', '@silyman']
  },
  execute(user?, replyNum?) {
    let person = this.author.username;
    let n = -1;

    if (user) {
      if (!replyNum && !isNaN(parseInt(user))) {
        n = parseInt(user);
      } else {
        const id = user.replace(/[^0-9]/g, '');
        const users = this.bot.client.users.cache;
        person = users.get(id)!.username;
      }
    }

    if (replyNum) {
      if (isNaN(parseInt(replyNum))) throw `pleez enter a repli numbar`;
      n = parseInt(replyNum);
    }

    const answer = n === -1 ? getBotReadyAnswer() : getBotReadyAnswer(n);

    return this.reply(`${smilieEnglish(person)}, ${answer}`);
  }
} as Command;
