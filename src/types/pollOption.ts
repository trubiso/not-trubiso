import { Message, MessageReaction } from "discord.js";
import { containsEmoji } from "../utils/containsEmoji";
import { PollOptionResolvable } from "./pollOptionResolvable";

/**
 * Manages a single option for a Poll.
 */
export class PollOption {
    /**
     * Can be a custom emote ID or an Unicode emoji.
     */
    public emojiId;
    /**
     * States whether the emojiId property contains an Unicode emoji or not.
     */
    public isUnicodeEmoji;
    /**
     * The message associated with this poll option.
     */
    public message;
    /**
     * How many reactions this poll option has (excluding the bot's reactions).
     */
    public count;

    /**
     * Turns a resolvable poll option object into a PollOption instance.
     * @param resolvable A resolvable poll option object (can also be an instance of PollOption).
     * @returns A poll option object.
     */
    static resolve(resolvable : PollOptionResolvable | PollOption) : PollOption {
        if (resolvable instanceof PollOption) return resolvable;
        else return new PollOption(resolvable.emojiId, resolvable.message);
    }

    /**
     * Gets how many reactions this poll option has and updates the internal count number.
     * @param reaction The reaction given by the messageReaction events in the client (optional).
     * @returns How many reactions this poll option has.
     */
    public getReactionCount(reaction?: MessageReaction) : number {
        if (this.isUnicodeEmoji) {
            if (reaction) if (reaction.emoji.name === this.emojiId) this.count = reaction.count;
        } else {
            if (reaction) if (reaction.emoji.id === this.emojiId) this.count = reaction.count;
        }
        return Math.max(this.count - 1, 0);
    }
    
    /**
     * @param emojiId The custom emote ID or Unicode emoji that corresponds to the option.
     * @param message The message associated to the option.
     */
    constructor(emojiId: string, message: Message) {
        this.emojiId = emojiId;
        this.isUnicodeEmoji = containsEmoji(emojiId);
        this.message = message;
        this.count = 0;
    }
}