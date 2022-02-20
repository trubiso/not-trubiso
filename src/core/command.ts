import { ButtonInteraction, Message, SelectMenuInteraction } from 'discord.js';
import Bot from '@core/bot';

export default interface Command {
    name: string;
    aliases?: string[];
    help: {
        category: string;
        brief: string;
        usage: string;
        extra?: string;
    };

    execute(message: Message, args: string[], bot: Bot): Promise<unknown> | void;
    handleButton?(interaction: ButtonInteraction, bot: Bot): Promise<unknown> | void;
    handleSelectMenu?(interaction: SelectMenuInteraction, bot: Bot): Promise<unknown> | void;
}
