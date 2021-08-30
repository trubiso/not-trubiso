import { Message, MessageReaction } from "discord.js";
import { PollOptionResolvable } from "./pollOptionResolvable";

export class PollOption {
    public emojiId;
    public message;
    public count;

    static resolve(resolvable : PollOptionResolvable | PollOption) : PollOption {
        if (resolvable instanceof PollOption) return resolvable;
        else return new PollOption(resolvable.emojiId, resolvable.message);
    }

    public async getReactionCount(reaction?: MessageReaction) : Promise<number> {
        if (reaction) if (reaction.emoji.id === this.emojiId.toString()) this.count = reaction.count;
        console.log(`reaction: ${reaction?.emoji.toString().split(':')[2].slice(0, -1)}: ${reaction?.count}, this: ${this.emojiId}: ${this.count}`);
        return this.count;
    }

    constructor(emojiId: string, message: Message) {
        this.emojiId = emojiId;
        this.message = message;
        this.count = 0;
    }
}