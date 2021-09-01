import { Message } from "discord.js";
import { Handler } from "../types/handler";
import { logCommand } from "./logCommand";
import { logError } from "./logError";

const { e } = require('../vars.json');

/**
 * Handles a command and its respective errors.
 * @param msg Message that the command was executed in.
 * @param handler The bot handler.
 */
export const handleCommand = (msg: Message, handler: Handler) : void => {
    const args = msg.content.slice(handler.prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase() ?? "";

    try {
        const actualCmd = handler.commands.get(command) ?? handler.commands.find(v => v.aliases?.includes(command) ?? false);
        if (actualCmd) {
            actualCmd.execute(msg, args, handler);
            logCommand(msg, args, command, handler);
        }
    } catch (error) {
        if (!(error instanceof TypeError)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            msg.channel.send(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} ${(error as any).toString()}`);
        } else {
            if (handler.commands.get(command)) logError(error);
        }
    }
};