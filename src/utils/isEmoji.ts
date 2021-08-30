import { emojiRegex } from "./emojiRegex";

export const isEmoji = (text : string) : boolean => !!text.match(emojiRegex);