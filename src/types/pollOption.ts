import { Message } from "discord.js";
import { PollOptionResolvable } from "./pollOptionResolvable";

export class PollOption {
    public emojiId;
    public message;

    static resolve(resolvable : PollOptionResolvable | PollOption) : PollOption {
        if (resolvable instanceof PollOption) return resolvable;
        else return new PollOption(resolvable.emojiId, resolvable.message);
    }

    public getReactionCount() : number {
        const reactionCount = this.message.reactions.resolveId(this.emojiId.toString());
        return parseInt(reactionCount);
    }

    constructor(emojiId: number, message: Message) {
        this.emojiId = emojiId;
        this.message = message;
    }
}