import { Util } from "discord.js";
import { Command } from "../../types/command";
const { smilie_english } = require("../../vars.json");

export = {
	name: 'translate',
	help: {
        category: 'fun',
		brief: 'translatese to smili englisheshe',
		usage: 'translate <text>'
	},
    execute(message, args) {
        let text = args.join(' ');
        Object.keys(smilie_english).forEach((v: string) => text = text.replaceAll(v, smilie_english[v]));
        message.reply(Util.cleanContent(text, message.channel));
    },
} as Command;