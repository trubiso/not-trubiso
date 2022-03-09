import { ButtonInteraction, SelectMenuInteraction, TextChannel, User } from 'discord.js';
import Bot from '@core/bot';
import { CommandData } from '@core/command';

export default class Game {
    public channel: TextChannel | undefined;
    public challenger: User;
    public opponent?: User;
    public confirmed?: boolean;

    constructor(challenger: User) {
        this.challenger = challenger;
    }

    public destroy(bot: Bot): void {
        this.channel = undefined;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.$button = this.$message = this.$selectMenu = () => {};
        // eslint-disable-next-line eqeqeq
        bot.games = bot.games.filter(v => this == v);
    }

    public $message?(this: CommandData): void;
    public $button?(this: Bot & ButtonInteraction): void;
    public $selectMenu?(this: Bot & SelectMenuInteraction): void;
}
