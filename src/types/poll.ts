import { Message } from "discord.js";
import { Handler } from "./handler";
import { PollOption } from "./pollOption";
import { PollOptionResolvable } from "./pollOptionResolvable";

export class Poll {
    public pollOptions : PollOption[];
    public message : Message;

    constructor(pollOptions: PollOptionResolvable[] | PollOption[], message: Message) {
        this.pollOptions = pollOptions.map(v => PollOption.resolve(v));
        this.message = message;
    }

    public updateMessage(handler: Handler) : void {
        const reactionCounts : number[] = this.pollOptions.map(v => v.getReactionCount());
        const totalReactions = reactionCounts.reduce((a, b) => a+b);
        const percentages = this.pollOptions.map(v => `${handler.client.emojis.cache.get(v.emojiId.toString())}: ${v.getReactionCount()} (${v.getReactionCount() * 100 / totalReactions}%)`).join(', ');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.message.embeds[0].fields.find(v => v.name == "statse")!.value = percentages;
    }

}