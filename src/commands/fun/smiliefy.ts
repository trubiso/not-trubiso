import { Message, Util } from 'discord.js';
import Command from '@core/command';

import { e } from '@core/vars';
import { pick } from '@core/utils';

export = {
    name: 'smiliefy',
    help: {
        category: 'fun',
        brief: 'smiliefies yuor texte',
        usage: 'smiliefy <text> [--times [number (1-5)]]'
    },
    execute(...args) {
        if (!args.length) throw 'giv me text to smiliefie';

        const randomEmote = (message: Message): string =>
            pick(message.guild?.emojis.cache.map(v => v.toString()) ?? []);

        const addRandomEmotes = (text: string, message: Message): string =>
            text
                .split(' ')
                .map(v => `${v} ${randomEmote(message)}`)
                .join(' ');

        let text = Util.cleanContent(args
            .join(' ')
            .replace(/--times [0-9]+/g, '')
            .trim(),
        this.channel);

        const numParam =
            args
                .join(' ')
                .match(/--times [0-9]+/g)
                ?.toString() ?? '--times 1';

        const num = Math.max(Math.min(parseInt(numParam.replace(/--times/g, '').trim()), 5), 1);

        [...Array(num).keys()].forEach(() => {
            text = addRandomEmotes(text, this);
        });

        if (text.length > 2000) throw `yur text is too bigege !! ${e.sad}`;
        else return this.reply(text);
    }
} as Command;
