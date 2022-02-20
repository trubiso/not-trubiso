import { Util } from 'discord.js';
import Command from '@core/command';

export = {
    name: 'say',
    help: {
        category: 'fun',
        brief: 'de bot wil say watever yu wantete !',
        usage: 'say <text>'
    },
    execute(message, args) {
        if (!args.length) throw 'gib me text to sey !!';

        const text = args.join(' ');
        message.reply(Util.cleanContent(text, message.channel));
    }
} as Command;
