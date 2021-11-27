import { Util } from "discord.js";
import { Command } from "../../types/command";
import smilieEnglish from "../../utils/smilieEnglish";

export = {
	name: 'translatealg',
	help: {
        category: 'fun',
		brief: 'translatese to smili englisheshe usinge an algroithm !',
		usage: 'translatealg <text>'
	},
    execute(message, args) {
        if (!args.length) {
            throw "gib me text to translat !!";
        }
        let text = args.join(' ').toLowerCase();
        text = smilieEnglish(Util.cleanContent(text, message.channel));
        message.reply(Util.cleanContent(text, message.channel));
    },
} as Command;