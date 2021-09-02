import { Handler } from "../types/handler";

/**
 * Checks whether a certain emote can be used by the bot.
 * @param emote Custom emote / ID of the custom emote.
 * @param handler The bot handler.
 * @returns Whether the emote is accessible by the bot.
 */
export const validateCustomEmote = (emote : string, handler : Handler) : boolean => {
    let e = emote;
    if (emote.includes(':')) {
        e = emote.split(':')[2].slice(0, -1);
    }
    return !!handler.client.emojis.cache.get(e);
};