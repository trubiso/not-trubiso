import Command from '@core/command';
import { smilieEnglish, getBotReadyAnswer } from '@core/utils';

export = {
  name: 'greetme',
  aliases: ['gm'],
  help: {
    category: 'random',
    brief: 'i greet u (or anoder preson !) !!!',
    usage: '[mention]'
  },
  execute(user?) {
    let person = this.author.username;

    if (user) {
      const id = user.replace(/[^0-9]/g, '');
      const users = this.bot.client.users.cache;
      person = users.get(id)!.username;
    }

    return this.reply(`${smilieEnglish(person)}, ${getBotReadyAnswer()}`);
  }
} as Command;
