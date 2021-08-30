import { Message, MessageReaction } from "discord.js";
import { isEmoji } from "../utils/isEmoji";
import { PollOptionResolvable } from "./pollOptionResolvable";

export class PollOption {
    public emojiId;
    public isUnicodeEmoji;
    public message;
    public count;

    static resolve(resolvable : PollOptionResolvable | PollOption) : PollOption {
        if (resolvable instanceof PollOption) return resolvable;
        else return new PollOption(resolvable.emojiId, resolvable.message);
    }

    public async getReactionCount(reaction?: MessageReaction) : Promise<number> {
        if (this.isUnicodeEmoji) {
            if (reaction) if (reaction.emoji.name === this.emojiId) this.count = reaction.count;
        } else {
            if (reaction) if (reaction.emoji.id === this.emojiId) this.count = reaction.count;
        }
        return Math.max(this.count - 1, 0);
    }

    constructor(emojiId: string, message: Message) {
        this.emojiId = emojiId;
        this.isUnicodeEmoji = isEmoji(emojiId);
        this.message = message;
        this.count = 0;
    }
}