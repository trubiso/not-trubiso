import { Message } from "discord.js";

const answers = require('../vars').permission_denied_answers;

export const permissionError = (message: Message) : void => {
    const answer_pos = Math.floor(Math.random()*answers.length);
    const answer = answers[answer_pos];
    message.reply(answer);
};