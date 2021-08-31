import { emojiRegex } from "./emojiRegex";

/**
 * Returns whether a string contains any emojis or not.
 * @param text The string to check.
 * @returns Whether your string does indeed contain any emojis or not.
 */
export const containsEmoji = (text : string) : boolean => !!text.match(emojiRegex);