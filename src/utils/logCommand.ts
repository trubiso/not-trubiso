import { Message } from "discord.js";
import { Handler } from "../types/handler";
import chalk from "chalk";

/**
 * Logs a command to the console, its respective arguments and whether it was used via an alias.
 * @param msg The message where the command was used.
 * @param args The arguments to the command.
 * @param command The extracted command from the message.
 * @param handler The bot's handler.
 */
export const logCommand = (msg : Message, args : string[], command : string, handler : Handler) : void => {
    const isAlias = !handler.commands.get(command) && handler.commands.find(v => v.aliases?.includes(command) ?? false);
    const commandName = handler.commands.get(command)?.name ?? handler.commands.find(v => v.aliases?.includes(command) ?? false)?.name ?? 'undefined';
    console.log(`${chalk.bgGrey('[LOG]')} ${
        chalk.grey(`${msg.author.username}#${msg.author.discriminator} used ${handler.prefix}${commandName}${isAlias ? ` (Alias of ${command})` : ``} (Arguments: ${args.join(' ')})`)
    }`);
};