import { Util } from "discord.js";
import { Command } from "../../types/command";
import { permissionError } from "../../utils/permissionError";
const { e } = require('../../vars.json');

export = {
	name: 'closepoll',
	help: {
        category: 'utils',
		brief: 'close a poll (it has to be yur polle, unless yur admine) !!',
		usage: 'closepoll <url>'
	},
    execute(message, args, handler) {
        if (!args.length) {
            throw "gib me a poll to closese !";
        }
        const poll = handler.polls.find(v => v.message.url === args[0].trim());
        if (!poll) {
            throw "dat poll is alredi closeded !";
        }
        if (poll.message.author.id !== message.author.id && !message.member?.permissions.has("ADMINISTRATOR")) {
            return permissionError(message);
        }
        const embed = poll.message.embeds[0];
        embed.title = `closeded polle !! ${e.shock_handless.e}`;
        poll.message.edit({embeds: [embed]});
        poll.updateMessage = () => { return; };

        handler.polls.filter(v => v.message.id !== poll.message.id);
        
        message.reply(Util.cleanContent(`succesfulie closeded polle **${embed.fields[0].name}** !!`, message.channel));
    },
} as Command;