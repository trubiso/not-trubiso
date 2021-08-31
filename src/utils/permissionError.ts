import { Message } from "discord.js";

const answers = require('../vars').permission_denied_answers;

/**
 * Replies to a specified message with a random permission denied answer.
 * @param message The message to reply to.
 */
export const permissionError = (message: Message) : void => {
    const answer_pos = Math.floor(Math.random()*answers.length);
    const answer = answers[answer_pos];
    message.reply(answer);
};