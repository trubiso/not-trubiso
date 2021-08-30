import { Command } from "../../types/command";
import { Poll } from "../../types/poll";
import { PollOptionResolvable } from "../../types/pollOptionResolvable";
import { permissionError } from "../../utils/permissionError";

const { e } = require('../../vars.json');

export = {
	name: 'poll',
	help: {
        category: 'utils',
		brief: 'creats a polle',
		usage: 'poll <title> | <description> | <optionEmoji> -> <optionDescription>,...',
	},
	async execute(message, args, handler) {
        if (!message.member?.permissions.has("ADMINISTRATOR")) {
            return permissionError(message);
        }
        
        const rawArgs = args.join(' ').split('|').map(v => v.trim());
        const title = rawArgs[0];
        const description = rawArgs[1];
        const rawOptions = rawArgs[2].split(',').map(v => v.trim()).map(v => {
            const optionParts = v.split('->').map(v => v.trim());
            const emojiId = optionParts[0].split(':')[2].slice(0, -1);
            const emojiDescription = optionParts[1];
            return {
                emoji: emojiId,
                description: emojiDescription
            };
        });

        const embed = {
            title: `polle !! ${e.shock_handless.e}`,
            fields: [
                {
                    name: title,
                    value: description
                },
                {
                    name: "optionse!",
                    value: rawOptions.map(v => {
                        return `${handler.client.emojis.cache.get(v.emoji)} for ${v.description}`;
                    }).join(', ')
                },
                {
                    name: "statse",
                    value: ""
                }
            ],
            author: {name: `starteded by ${message.author.username} !!`}
        };

        const pollMessage = await message.reply({embeds: [embed]});
        rawOptions.forEach(v => pollMessage.react(v.emoji));
        const pollObject = new Poll(rawOptions.map(v => ({emojiId: parseInt(v.emoji), message: pollMessage} as PollOptionResolvable)), pollMessage);
        handler.polls.push(pollObject);
	}
} as Command;