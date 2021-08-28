import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'randomemote',
    aliases: ['re'],
	help: {
        category: 'fun',
		brief: 'sends a random emot for yu !',
		usage: 'randomemote [num (up to 5)]'
	},
    execute(message, args, handler) {
        let num = args[0] ? parseInt(args[0]) : 1;
        let arr = message.guild!.emojis.cache.map(v => v.toString());
        let emojis : string[] = [];

        [...Array(num).keys()].forEach(()=>{
            emojis.push(arr[Math.floor(Math.random()*arr.length)]);
        });

        message.reply(emojis.join(''));
    },
} as Command;