import Command from '@core/command';
import { e } from '@core/vars';

export = {
  name: 'test',
  aliases: ['kangaroo', 'clicker'],
  help: {
    brief: 'test comande'
  },
  execute() {
    this.reply(`oh hi ${e.happy}`);
  }
} as Command;
