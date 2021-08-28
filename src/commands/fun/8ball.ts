import { Command } from "../../types/command";
const { e } = require('../../vars.json');
const answers = require('../../vars').eightball_answers;

export = {
	name: '8ball',
	help: {
        category: 'fun',
		brief: 'da smili gods will decied if they can agree with somthing!',
		usage: '8ball <question>'
	},
    execute(message, args) {
        if (!args.length) {
            message.channel.send(`yu hab to ask a questione! ${e.really.e}`);
        }
        else {
            const answer_pos = Math.floor(Math.random()*answers.length);
            const answer = answers[answer_pos];

            message.reply(answer);
        }
    },
} as Command;