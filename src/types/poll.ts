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

    public async updateMessage(reaction?: MessageReaction) : Promise<void> {
        const reactionCounts : number[] = await Promise.all(this.pollOptions.map(async v => await v.getReactionCount(reaction)));
        const totalReactions = reactionCounts.reduce((a, b) => a+b);
        const percentageArray = await Promise.all(this.pollOptions.map(async v => `${this.message.guild?.emojis.cache.get(v.emojiId.toString())?.toString()}: ${await v.getReactionCount(reaction)} (${(await v.getReactionCount(reaction) * 100 / totalReactions).toFixed(0)}%)`));
        let percentages = percentageArray.join(', ');
        if (!percentages) percentages = "no reactionese yet !";
        const embed = this.message.embeds[0];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        embed.fields.find(v => v.name === "statse")!.value = percentages;
        this.message.edit({embeds: [embed]});
    }

}