import Command from '@core/command';
import { e } from '@core/vars';

export = {
    name: 'happy',
    aliases: [e.happy],
    help: {
        category: 'fun',
        brief: e.happy,
        usage: 'happy'
    },
    execute(message) {
        message.reply(`${e.happy}${e.happy}${e.happy} i'm happi tooe!`);
    }
} as Command;
