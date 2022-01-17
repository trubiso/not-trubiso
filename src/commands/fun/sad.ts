import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'sad',
    aliases: [e.sad],
	help: {
        category: 'fun',
		brief: e.sad,
		usage: 'sad'
	},
    execute(message) {
        message.reply(`dont be sade!!! be happi!! ${e.happy}${e.happy}${e.happy}`);
    },
} as Command;