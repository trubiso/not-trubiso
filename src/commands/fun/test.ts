import Command from '@core/command';
import { e } from '@core/vars';

export = {
    name: 'test',
    aliases: ['kangaroo', 'clicker'],
    help: {
        category: 'fun',
        brief: 'test comande',
        usage: 'test'
    },
    execute() {
        this.reply(`oh hi ${e.happy}`);
    }
} as Command;
