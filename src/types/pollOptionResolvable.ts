import { Message } from "discord.js";

/**
 * The PollOptionResolvable type defines the guidelines for an object that can be resolved into a PollOption.
 */
export type PollOptionResolvable = {
    /**
     * The custom emote ID or Unicode emoji that corresponds to the option.
     */
    emojiId: string,
    /**
     * The message associated to the option.
     */
    message: Message
}