import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'happy',
    aliases: [e.happy],
	help: {
        category: 'fun',
		brief: e.happy,
		usage: 'happy'
	},
    execute(message) {
        message.reply(`${e.happy}${e.happy}${e.happy} i'm happi tooe!`);
    },
} as Command;
