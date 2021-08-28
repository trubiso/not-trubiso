import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'happy',
    aliases: [e.happy.e],
	help: {
        category: 'fun',
		brief: e.happy.e,
		usage: 'happy'
	},
    execute(message) {
        message.reply(`${e.happy.e}${e.happy.e}${e.happy.e} i'm happi tooe!`);
    },
} as Command;