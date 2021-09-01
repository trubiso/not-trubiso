import { Message, TextChannel } from "discord.js";
import ora from "ora";
import { Handler } from "../types/handler";

const { e } = require('../vars.json');

/**
 * Finds poll messages that the bot has posted.
 * @param handler The bot handler.
 * @returns An array with the messages that have been found.
 */
export const findPollMessages = async (handler: Handler) : Promise<Message[]> => {
    const spinner = ora({
        text: 'Fetching poll messages...',
        spinner: 'bouncingBall',
        color: 'yellow'
    }).start();
    const textChannels = handler.client.channels.cache.filter(v => v.isText());
    const messages = await Promise.all(textChannels.map(async v => await (v as TextChannel).messages.fetch({
        limit: 100
    }).then(messages => {
        const botMessages = [...messages.filter(v => v.author.id === handler.client.user?.id).values()];
        return botMessages.filter(v => !!v.embeds).filter(v => v.embeds[0]?.title === `polle !! ${e.shock_handless.e}`);
    })));
    const messageArr = messages.filter(v => v.length).flat(1);
    spinner.succeed(`Fetched ${messageArr.length} poll messages.`);
    return messageArr;
};