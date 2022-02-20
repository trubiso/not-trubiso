import { Util } from 'discord.js';
import Command from '@core/command';
import { smilieEnglish } from '@core/utils';

export = {
    name: 'translate',
    help: {
        category: 'fun',
        brief: 'translatese to smili englisheshe usinge an algroithm !',
        usage: 'translate <text>'
    },
    execute(message, args) {
        if (!args.length) throw 'gib me text to translat !!';

        let text = args.join(' ').toLowerCase();
        text = smilieEnglish(Util.cleanContent(text, message.channel));
        message.reply(Util.cleanContent(text, message.channel));
    }
} as Command;
