import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'version',
	help: {
        category: 'utils',
		brief: 'i tel yu my version !',
		usage: 'version'
	},
    execute(message) {
        message.reply(`my vresione is **TS Rewrite Beta 10** ${e.think.e}`);
    },
} as Command;