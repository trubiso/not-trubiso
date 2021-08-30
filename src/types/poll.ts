import { Message, MessageReaction } from "discord.js";
import { PollOption } from "./pollOption";
import { PollOptionResolvable } from "./pollOptionResolvable";

export class Poll {
    public pollOptions : PollOption[];
    public message : Message;

    constructor(pollOptions: PollOptionResolvable[] | PollOption[], message: Message) {
        this.pollOptions = pollOptions.map(v => PollOption.resolve(v));
        this.message = message;
    }

    public updateMessage(reaction?: MessageReaction) : void {
        const reactionCounts : number[] = this.pollOptions.map(v => v.getReactionCount(reaction));
        const totalReactions = reactionCounts.reduce((a, b) => a+b);
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