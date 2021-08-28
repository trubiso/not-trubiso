import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'sad3',
    aliases: [e.sad3.e],
	help: {
        category: 'fun',
		brief: e.sad3.e,
		usage: 'sad3'
	},
    execute(message) {
        message.reply(`i'm sade tooe... ${e.sad3.e}`);
    },
} as Command;