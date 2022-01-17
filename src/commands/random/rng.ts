import { Command } from "../../types/command";
const { e } = require('../../vars.json');
const answers = require('../../vars').pick_answers;

export = {
	name: 'rng',
	aliases: ['random-number'],
	help: {
        category: 'random',
		brief: 'picks numbr acording to de limits yu giv it !',
		usage: 'rng <max|min, max>',
	},
	execute(message, args) {
		const min = parseInt((args[1] ? args[0] : 1) as string);
		const max = parseInt(((args[1] ?? args[0]) ?? 10)) + 1;
		const num = Math.floor(Math.random() * (max - min)) + min;
		if (args.length > 2) {
			throw "yu gaev me too meny arguments !!";
		}
		if (isNaN(num)) {
			throw `yu shuld giv me actual numberse ${e.think}`;
		}
		const answer = answers[Math.floor(Math.random() * answers.length)].replace(/{i}/g, `**${num}**`);
        return message.reply(answer);
	}
} as Command;