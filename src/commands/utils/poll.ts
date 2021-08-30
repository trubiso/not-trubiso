import { Command } from "../../types/command";
import { Poll } from "../../types/poll";
import { PollOptionResolvable } from "../../types/pollOptionResolvable";
import { getEmojis } from "../../utils/getEmojis";
import { isEmoji } from "../../utils/isEmoji";

const { e } = require('../../vars.json');

export = {
	name: 'poll',
	help: {
        category: 'utils',
		brief: 'creats a polle',
		usage: 'poll <title> | <description> | <optionEmoji> -> <optionDescription>,...',
	},
	async execute(message, args, handler) {
        const rawArgs = args.join(' ').split('|').map(v => v.trim());
        const title = rawArgs[0];
        const description = rawArgs[1];
        const rawOptions = rawArgs[2].split(',').map(v => v.trim()).map(v => {
            const optionParts = v.split('->').map(v => v.trim());
            let emojiId : string;
            if (isEmoji(optionParts[0])) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                emojiId = getEmojis(optionParts[0])[0];
            } else {
                try {
                    emojiId = optionParts[0].split(':')[2].slice(0, -1);
                } catch (error) {
                    message.reply(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} yu hav to use proper emojise for option emojiese ${e.sad.e}`);
                    throw "non-proper emojiese in option emojiese";
                }
            }
            const emojiDescription = optionParts[1];
            return {
                emoji: emojiId,
                description: emojiDescription
            };
        });

        const rawOptionsEmojis = rawOptions.map(v => v.emoji);

        if (new Set(rawOptionsEmojis).size !== rawOptionsEmojis.length) {
            message.reply(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} yu cant hav moar dan wan optione asocieted to wan emoji ! ${e.sad.e}`);
            return;
        }

        if (!title) {
            message.reply(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} giv a titel to de poll !! ${e.sad.e}`);
            return;
        }

        if (!description) {
            message.reply(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} yu hav to giv a descriptionene for de polle ! ${e.sad.e}`);
            return;
        }

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
                        return `${isEmoji(v.emoji) ? v.emoji : handler.client.emojis.cache.get(v.emoji)} for ${v.description}`;
                    }).join(', ')
                },
                {
                    name: "statse",
                    value: "no reactionese yet !"
                }
            ],
            author: {name: `starteded by ${message.author.username} !!`}
        };

        const pollMessage = await message.reply({embeds: [embed]});
        rawOptions.forEach(async v => await pollMessage.react(v.emoji));
        const pollObject = new Poll(rawOptions.map(v => ({emojiId: v.emoji, message: pollMessage} as PollOptionResolvable)), pollMessage);
        pollObject.updateMessage();
        handler.polls.push(pollObject);
	}
} as Command;