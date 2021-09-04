import { ButtonInteraction, Message, SelectMenuInteraction } from "discord.js";
import { Handler } from "./handler";

/**
 * The Command type defines guidelines for a command object for the command handler.
 */
export type Command = {
	/**
	 * Name for the command (should be the same one as the filename, and should be lowercase).
	 */
    name: string,
	/**
	 * Different names that the command can be called with.
	 */
    aliases?: string[],
	/**
	 * Help for the command.
	 */
	help: {
		/**
		 * The category that this command belongs to.
		 */
        category: string,
		/**
		 * A brief description about what this command does.
		 */
		brief: string,
		/**
		 * How this command should be used (arguments should follow standard notation).
		 */
		usage: string,
		/**
		 * Any extra information that you want to show in the help command.
		 */
		extra?: string
	},
	/**
	 * The function that gets called to execute the command.
	 * Can be set as asynchronous.
	 * 
	 * @param message The message that executed this command.
	 * @param args Each argument that has been inputted to the command.
	 * @param handler The bot handler.
	 */
	execute(message: Message, args: string[], handler: Handler) : Promise<unknown> | void,
	/**
	 * The function that gets called to handle button interactions.
	 * Can be set as asynchronous.
	 * 
	 * @param interaction The interaction received by the 'interactionCreate' event.
	 * @param handler The bot handler.
	 */
	handleButton?(interaction: ButtonInteraction, handler : Handler) : Promise<unknown> | void,
	/**
	 * The function that gets called to handle select menu interactions.
	 * Can be set as asynchronous.
	 * 
	 * @param interaction The interaction received by the 'interactionCreate' event.
	 * @param handler The bot handler.
	 */
	handleSelectMenu?(interaction: SelectMenuInteraction, handler : Handler) : Promise<unknown> | void
}