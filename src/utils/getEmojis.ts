import { emojiRegex } from "./emojiRegex";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getEmojis = (text : string) : string[] => text.match(emojiRegex)!;