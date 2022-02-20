import { GuildMember, Message, TextChannel } from 'discord.js';
import Bot from '@core/bot';
import { getBotReadyAnswer, pick } from './utils';
import { e } from './vars';

export default class Handler {
    private bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    public $ready(isDev = false) {
        console.log(`Logged in as ${this.bot.client.user?.tag}!`);
        this.bot.client.user?.setPresence({ activities: [{ name: 'yu !!', type: 'LISTENING' }] });

        if (isDev) return;

        let c;
        if (this.bot.client.guilds.cache.has('717683408012181505'))
            if ((c = this.bot.client.channels.cache.get('717683408553377815')))
                (c as TextChannel).send(getBotReadyAnswer());
    }

    public $error(msg: Message, command: string, error: any) {
        if (error instanceof TypeError) this.bot.logger.logError(error);
        else
            msg.channel.send(`${e.shock_handless} ther was an eror executinge yuor comande !! ${e.sad} ${error.toString()}`);
    }

    public $guildMemberAdd(member: GuildMember) {
        if (member.guild.id === '717683408012181505') {
            const r = ['725843105445576796', '725843316662468641'];
            let c, v;
            if ((c = this.bot.client.guilds.cache.get('717683408012181505')))
                if ((v = c.roles.resolve(pick(r)))) member.roles.add(v);
        }
    }

    public async $command(msg: Message) {
        const args = msg.content.slice(this.bot.prefix.length).trim().split(/ +/);
        const command = args.shift()?.toLowerCase() ?? '';

        try {
            const actualCmd =
                this.bot.commands.get(command) ?? this.bot.commands.find(v => v.aliases?.includes(command) ?? false);
            if (actualCmd) {
                const boundThis = Object.assign({}, msg, this.bot);
                await (actualCmd.execute.call(boundThis, ...args) as Promise<unknown>)?.catch(error => {
                    this.$error(msg, command, error);
                });
                this.bot.logger.logCommand(msg, args, command);
            }
        } catch (error) {
            this.$error(msg, command, error);
        }
    }

    public async $messageCreate(msg: Message) {
        if (!msg.mentions.everyone) {
            if (msg.mentions.has(this.bot.client.user!)) (await msg.react('👋')).message.react(e.id(e.happy));

            if (msg.content.includes('busines')) msg.react(e.id(e.business));
        }

        // TODO: check whether there is an ongoing game in that channel; if so,
        // check whether player is in that game, if they are, let game handle, otherwise see below
        if (!msg.author.bot && msg.content.startsWith(this.bot.prefix)) await this.$command(msg);
    }
}
