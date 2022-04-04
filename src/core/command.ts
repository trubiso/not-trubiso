import { ButtonInteraction, Message, SelectMenuInteraction } from 'discord.js';
import Bot from '@core/bot';

export interface CommandMetadata {
  name: string;
  aliases?: string[];
  help: {
    category: string;
    brief: string;
    usage?: string;
    extra?: string;
  };
}

export interface CommandFunctions {
  execute(this: CommandData, ...args: string[]): Promise<unknown> | void;
  handleButton?(interaction: ButtonInteraction, bot: Bot): Promise<unknown> | void;
  handleSelectMenu?(interaction: SelectMenuInteraction, bot: Bot): Promise<unknown> | void;
}

type Command = CommandMetadata & CommandFunctions;
export default Command;

export type CommandData = Message & { bot: Bot };
