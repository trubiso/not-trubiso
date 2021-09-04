import { Command } from "../../types/command";
import { Poll } from "../../types/poll";
import { PollOptionResolvable } from "../../types/pollOptionResolvable";
import { getEmojis } from "../../utils/getEmojis";
import { containsEmoji } from "../../utils/containsEmoji";
import { validateCustomEmote } from "../../utils/validateCustomEmote";
import { MessageActionRow, MessageSelectMenu } from "discord.js";

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
            throw `com on !! giv me arguments !! ${e.sad.e}`;
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
                throw `yu hav to use proper emojise for option emojiese ${e.sad.e}`;
            }
        }
        
        const rawOptionsEmojis = rawOptions.map(v => v.emoji);

        if (new Set(rawOptionsEmojis).size !== rawOptionsEmojis.length) {
            throw `yu cant hav moar dan wan optione asocieted to wan emoji ! ${e.sad.e}`;
        }

        if (!rawOptionsEmojis.every(v => (parseInt(v) ? validateCustomEmote(v, handler) : containsEmoji(v)))) {
            throw `yu gaev me an emotete i cant accese !`;
        }

        if (!title) {
            throw `giv a titel to de poll !! ${e.sad.e}`;
        }

        if (!description) {
            throw `yu hav to giv a descriptionene for de polle ! ${e.sad.e}`;
        }

        const embed = {
            title: `polle !! ${e.shock_handless.e}`,
            fields: [
                {
                    name: title,
                    value: description
                },
                {
                    name: "statse",
                    value: "no reactionese yet !"
                }
            ],
            author: {name: `starteded by ${message.author.username} !!`}
        };

        const select = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('poll_select')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setPlaceholder('select an opteion !')
                    .addOptions(
                        rawOptions.map((v, i) => {return {
                            label: 'optione ' + (i + 1),
                            description: v.description,
                            value: v.emoji,
                            emoji: v.emoji
                        };})
                    )
            );

        const pollMessage = await message.reply({embeds: [embed], components: [select]});
        const pollObject = new Poll(rawOptions.map(v => ({emojiId: v.emoji, message: pollMessage} as PollOptionResolvable)), pollMessage);
        handler.polls.push(pollObject);
	},
    async handleSelectMenu(interaction, handler) {
        if (interaction.customId === 'poll_select') {            
            const poll = handler.polls.find(v => v.message.id === interaction.message.id);
            if (poll) {
                const option = poll.pollOptions.find(v => v.emojiId === interaction.values[0]);
                if (option) {
                    if (!option.users.includes(interaction.user.id)) {
                        if (poll.pollOptions.filter(v => v.emojiId !== option.emojiId).filter(v => v.users.includes(interaction.user.id)).length) {
                            poll.pollOptions.filter(v => v.emojiId !== option.emojiId).filter(v => v.users.includes(interaction.user.id)).forEach(v => {
                                v.users = v.users.filter(y => y !== interaction.user.id);
                                v.count --;
                            });
                        }
                        option.users.push(interaction.user.id);
                        option.count ++;
                        await interaction.update({embeds: poll.message.embeds, components: poll.message.components});
                        poll.updateMessage();
                    } else {
                        option.users = option.users.filter(v => v !== interaction.user.id);
                        option.count --;
                        await interaction.update({embeds: poll.message.embeds, components: poll.message.components});
                        poll.updateMessage();
                    }
                }
            }
        }
    }
} as Command;