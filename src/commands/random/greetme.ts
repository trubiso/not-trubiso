import Command from '@core/command';
import { smilieEnglish, getBotReadyAnswer } from '@core/utils';

export = {
  name: 'greetme',
  aliases: ['gm'],
  help: {
    category: 'random',
    brief: 'i greet u (or anoder preson !) !!!',
    usage: 'greetme [mention]'
  },
  execute(...args) {
    let person = this.author.username;
    if (args[0]) person = this.bot.client.users.cache.get(args[0].replaceAll(/[^0-9]/g, ''))!.username;

    return this.reply(`${smilieEnglish(person)}, ${getBotReadyAnswer()}`);
  }
} as Command;
