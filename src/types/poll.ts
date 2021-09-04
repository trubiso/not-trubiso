import { Message } from "discord.js";
import { PollOption } from "./pollOption";
import { PollOptionResolvable } from "./pollOptionResolvable";

/**
 * Takes care of managing, updating and restoring polls.
 */
export class Poll {
    /**
     * The options for the poll.
     */
    public pollOptions : PollOption[];
    /**
     * The message associated with the poll.
     */
    public message : Message;

    /**
     * @param pollOptions Options for the poll (can be either a poll properties array or a PollOption array).
     * @param message The message associated with the poll.
     */
    constructor(pollOptions: PollOptionResolvable[] | PollOption[], message: Message) {
        this.pollOptions = pollOptions.map(v => PollOption.resolve(v));
        this.message = message;
    }

    /**
     * Updates the poll's message.
     */
    public updateMessage() : void {
        const reactionCounts : number[] = this.pollOptions.map(v => v.getReactionCount());
        let totalReactions = 1;
        try {
            totalReactions = reactionCounts.reduce((a, b) => a+b);
        // eslint-disable-next-line no-empty
        } catch (e) {}
        const percentageArray = this.pollOptions.map(v => {
            let emoji;
            if (v.isUnicodeEmoji) emoji = v.emojiId;
            else emoji = this.message.guild?.emojis.cache.get(v.emojiId)?.toString();
            const reactionCount = v.getReactionCount();
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