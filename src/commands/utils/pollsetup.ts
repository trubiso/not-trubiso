import { Command } from "../../types/command";
import { PollSetup } from "../../types/pollSetup";

const { e } = require('../../vars.json');

export = {
	name: 'pollsetup',
	help: {
        category: 'utils',
		brief: 'set up a polleing !',
		usage: 'poll <title>',
	},
	execute(message, args, handler) {
        if (!args.length) throw `giv me a title to giv to yur dum poll ! ${e.angry_pink.e}`;
        handler.games.push(new PollSetup(message, args.join(' ').trim()));
	}
} as Command;