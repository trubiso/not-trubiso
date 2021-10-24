import { Util } from "discord.js";
import { Command } from "../../types/command";

const { e, alphabets } = require('../../vars.json');

function fancifyWord(word: string): string {
    const c: string[] = alphabets[Math.floor(Math.random()*(alphabets.length-1)+1)].split(',');
    const a: string[] = alphabets[0].split(',');
    let o = word;
    a.forEach((v, i) => o = o.replaceAll(v, c[i]));
    return o;
}

export = {
	name: 'fancify',
	help: {
        category: 'fancify',
		brief: 'fancifies yuor texte',
		usage: 'fancify <text>',
	},
	execute(message, args) {
        if (!args.length) {
            throw "giv me text to fancifie";
        }
        let text = Util.cleanContent(args.join(' ').trim(), message.channel);
        text = text.split(' ').map(v => {
            return fancifyWord(v);
        }).join(' ');

        if (text.length > 2000) throw `yur text is too bigege !! ${e.sad.e}`;
        else return message.reply(text);
	}
} as Command;