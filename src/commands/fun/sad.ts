import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'sad',
    aliases: [e.sad.e],
	help: {
        category: 'fun',
		brief: e.sad.e,
		usage: 'sad'
	},
    execute(message) {
        message.reply(`dont be sade!!! be happi!! ${e.happy.e}${e.happy.e}${e.happy.e}`);
    },
} as Command;