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
        if (reaction) if (reaction.emoji.id === this.emojiId) this.count = reaction.count;
        return this.count - 1;
    }

    constructor(emojiId: string, message: Message) {
        this.emojiId = emojiId;
        this.message = message;
        this.count = 0;
    }
}