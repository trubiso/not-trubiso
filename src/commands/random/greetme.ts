import { Command } from "../../types/command";
import v from "../../vars";
import smilieEnglish from "../../utils/smilieEnglish";

export = {
	name: 'greetme',
    aliases: ['gm'],
	help: {
        category: 'random',
		brief: 'i greet u (or anoder preson !) !!!',
		usage: 'greetme [mention]'
	},
    execute(message, args, handler) {
        let person = message.author.username;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (args[0]) person = handler.client.users.cache.get(args[0].replaceAll(/[^0-9]/g, ''))!.username;
        return message.reply(`${smilieEnglish(person)}, ${v.get_bot_ready_answer()}`);
    },
} as Command;