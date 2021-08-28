import { Message } from "discord.js";
import { Handler } from "./handler";

export type Command = {
    name: string,
    aliases?: string[],
	help: {
        category: string,
		brief: string,
		usage: string,
		extra?: string
	},
	execute(message: Message, args: string[], handler: Handler) : void
}