import { Message, MessageReaction } from "discord.js";
import { customEmoteRegex } from "../utils/customEmoteRegex";
import { emojiRegex } from "../utils/emojiRegex";
import { isEmoji } from "../utils/isEmoji";
import { PollOption } from "./pollOption";
import { PollOptionResolvable } from "./pollOptionResolvable";

export class Poll {
    public pollOptions : PollOption[];
    public message : Message;

    constructor(pollOptions: PollOptionResolvable[] | PollOption[], message: Message) {
        this.pollOptions = pollOptions.map(v => PollOption.resolve(v));
        this.message = message;
    }

    static restorePollFromMessage(message: Message) : Poll | undefined {
        const optionEmojiRegex = new RegExp(new RegExp(emojiRegex).source + '|' + new RegExp(customEmoteRegex).source, 'g');
        const optionEmojis = Array.from(message.embeds[0].fields[1].value.matchAll(optionEmojiRegex), m => m[0]).filter(v => v.length);
        const options = optionEmojis.map(v => {
            let emojiId: string;
            if (isEmoji(v)) {
                emojiId = v;
            } else {
                try {
                    emojiId = v.split(':')[2].slice(0, -1);
                } catch (e) {
                    return {
                        emojiId: '',
                        message: message
                    };
                }
            }
            return {
                emojiId: emojiId,
                message: message
            } as PollOptionResolvable;
        }).filter(v => v.emojiId !== '');
        if (options) {
            const processedOptions = options.map(v => PollOption.resolve(v));
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            try { processedOptions.forEach(v => {
                const count = message.reactions.cache.get(v.emojiId)?.count;
                if (count) v.count = count;
                else throw undefined;
            }); } catch(e) { return undefined; }
            return new Poll(processedOptions, message);
        }
        else return undefined;
    }

    public updateMessage(reaction?: MessageReaction) : void {
        const reactionCounts : number[] = this.pollOptions.map(v => v.getReactionCount(reaction));
        let totalReactions = 1;
        try {
            totalReactions = reactionCounts.reduce((a, b) => a+b);
        // eslint-disable-next-line no-empty
        } catch (e) {}
        const percentageArray = this.pollOptions.map(v => {
            let emoji;
            if (v.isUnicodeEmoji) emoji = v.emojiId;
            else emoji = this.message.guild?.emojis.cache.get(v.emojiId)?.toString();
            const reactionCount = v.getReactionCount(reaction);
            const percentage = reactionCount * 100 / totalReactions;
            const percentageString = isNaN(percentage) ? "0" : percentage.toFixed(0);
            return `${emoji}: ${reactionCount} (${percentageString}%)`;
        });
        let percentages = percentageArray.join(', ');
        if (!percentages) percentages = "no reactionese yet !";
        const embed = this.message.embeds[0];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        embed.fields.find(v => v.name === "statse")!.value = percentages;
        this.message.edit({embeds: [embed]});
    }

}