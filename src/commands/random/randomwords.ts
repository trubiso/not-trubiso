import { Command } from "../../types/command";
const { smilie_english } = require("../../vars.json");

export = {
	name: 'randomwords',
    aliases: ['rw'],
	help: {
        category: 'random',
		brief: 'sends randome wordse for yu !',
		usage: 'randomwords [num (up to 25)]'
	},
    execute(message, args) {
        const num = Math.min(Math.max(args[0] ? parseInt(args[0]) : 5, 1), 25);
        const arr : string[] = Object.values(smilie_english);
        const out : string[] = [];

        [...Array(num).keys()].forEach(()=>{
            out.push(arr[Math.floor(Math.random()*arr.length)]);
        });

        message.reply(out.join(' '));
    },
} as Command;