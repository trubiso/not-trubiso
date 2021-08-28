import { Message, Util } from "discord.js";
import { Command } from "../../types/command";

const { e } = require('../../vars.json');

const randomEmote = (message : Message) : string => {
    const arr = message.guild?.emojis.cache.map(v => v.toString()) ?? [];
    return arr[Math.floor(Math.random()*arr.length)];
};

const addRandomEmotes = (text : string, message : Message) : string => {
    return text.split(' ').map(v => `${v} ${randomEmote(message)}`).join(' ');
};

export = {
	name: 'smiliefy',
	help: {
        category: 'fun',
		brief: 'smiliefies yuor texte',
		usage: 'smiliefy <text> [--times [number]]',
	},
	execute(message, args) {
        if (!args.length) {
            throw "giv me text to smiliefie";
        }
        let text = Util.cleanContent(args.join(' ').replace(/--times [0-9]+/g, ''), message.channel);
        const num_param = args.join(' ').match(/--times [0-9]+/g)?.toString() ?? "--times 1";
        const num = parseInt(num_param.replace(/--times/g, '').trim());

        [...Array(num).keys()].forEach(()=>{
            text = addRandomEmotes(text, message);
        });

        if (text.length > 4000) throw `yur text is too bigege !! ${e.sad.e}`;

        return message.reply(text);
	}
} as Command;