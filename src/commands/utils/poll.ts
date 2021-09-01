import { Command } from "../../types/command";
import { Poll } from "../../types/poll";
import { PollOptionResolvable } from "../../types/pollOptionResolvable";
import { getEmojis } from "../../utils/getEmojis";
import { containsEmoji } from "../../utils/containsEmoji";

const { e } = require('../../vars.json');

export = {
	name: 'poll',
	help: {
        category: 'utils',
		brief: 'creats a polle',
		usage: 'poll <title> | <description> | <optionEmoji> -> <optionDescription>,...',
	},
	async execute(message, args, handler) {
        if (!args.length) {
            message.reply(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} com on !! giv me arguments !! ${e.sad.e}`);
            return;
        }
        const rawArgs = args.join(' ').split('|').map(v => v.trim());
        const title = rawArgs[0];
        const description = rawArgs[1];
        type rawOption = {
            emoji: string,
            description: string
        };
        let rawOptions : rawOption[] = [];
        try {
            rawOptions = rawArgs[2].split(',').map(v => v.trim()).map(v => {
                const optionParts = v.split('->').map(v => v.trim());
                let emojiId : string;
                if (containsEmoji(optionParts[0])) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    emojiId = getEmojis(optionParts[0])[0];
                } else {
                    try {
                        emojiId = optionParts[0].split(':')[2].slice(0, -1);
                    } catch (error) {
                        throw "emojis";
                    }
                }
                const emojiDescription = optionParts[1];
                return {
                    emoji: emojiId,
                    description: emojiDescription
                };
            });
        } catch (error) {
            if (error === "emojis") {
                message.reply(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} yu hav to use proper emojise for option emojiese ${e.sad.e}`);
                return;
            }
        }
        
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
                        return `${containsEmoji(v.emoji) ? v.emoji : handler.client.emojis.cache.get(v.emoji)} for ${v.description}`;
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