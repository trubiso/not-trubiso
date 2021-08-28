import { Message, Util } from "discord.js";
import { Command } from "../../types/command";
const { e } = require('../../vars.json');
const answers = require('../../vars').pick_answers;

const randomEmote = (message : Message) : string => {
    const arr = message.guild?.emojis.cache.map(v => v.toString()) ?? [];
    return arr[Math.floor(Math.random()*arr.length)];
};

const addRandomEmotes = (text : string, message : Message) : string => {
    return text.split(' ').map(v => `${v}${randomEmote(message)}`).join(' ');
};

export = {
	name: 'smiliefy',
	help: {
        category: 'fun',
		brief: 'smiliefies yuor texte',
		usage: 'smiliefy <text> [--times [number]]',
	},
	execute(message, args) {
        let text = Util.cleanContent(args.join(' ').replace(/--times [0-9]+/g, ''), message.channel);
        const num = parseInt(((args.join(' ').match(/--times [0-9]+/g) ?? "--times 1") as string).replace(/--times/g, '').trim());

        [...Array(num).keys()].forEach(()=>{
            text = addRandomEmotes(text, message);
        });

        return message.reply(text);
	}
} as Command;