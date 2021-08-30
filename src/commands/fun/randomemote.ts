import { Command } from "../../types/command";

export = {
	name: 'randomemote',
    aliases: ['re'],
	help: {
        category: 'fun',
		brief: 'sends a random emot for yu !',
		usage: 'randomemote [num (up to 5)]'
	},
    execute(message, args) {
        const num = Math.min(Math.max(args[0] ? parseInt(args[0]) : 1, 1), 5);
        const arr = message.guild?.emojis.cache.map(v => v.toString()) ?? [];
        const emojis : string[] = [];

        [...Array(num).keys()].forEach(()=>{
            emojis.push(arr[Math.floor(Math.random()*arr.length)]);
        });

        message.reply(emojis.join(''));
    },
} as Command;