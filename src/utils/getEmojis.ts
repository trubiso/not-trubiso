import { emojiRegex } from "./emojiRegex";

/**
 * Gets all of the Unicode emojis from a specified string.
 * @param text The string to get the emojis from.
 * @returns All of the emojis found in the string.
 */
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getEmojis = (text : string) : string[] => text.match(emojiRegex)!;