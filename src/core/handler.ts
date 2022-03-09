import { ButtonInteraction, GuildMember, Interaction, Message, TextChannel } from 'discord.js';
import Bot from '@core/bot';
import { getBotReadyAnswer, pick } from '@core/utils';
import { e } from '@core/vars';

export default class Handler {
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public $ready(isDev = false) {
    console.log(`Logged in as ${this.bot.client.user?.tag}!`);
    this.bot.client.user?.setPresence({ activities: [{ name: 'yu !!', type: 'LISTENING' }] });

    /*
        // GET EMOTES FOR WEBSITE
        const emoteNames = [];
        const emoteLinks = [];
        const emotes = [];
        for (const guild of [...this.bot.client.guilds.cache.values()].filter(v => !['551507531097178113', '729104446948376707'].includes(v.id))) {
            const guildEmojis = [...guild.emojis.cache.values()];
            emotes.push(...guildEmojis.map(v => ({ name: v.name, link: v.url, creationDate: v.createdAt })));
        }
        emotes.sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime());
        for (const emote of emotes) {
            emoteNames.push(emote.name);
            emoteLinks.push(emote.link);
        }
        console.log('%j', { emoteNames, emoteLinks });
        */

    if (isDev) return;

    let c;
    if (this.bot.client.guilds.cache.has('717683408012181505'))
      if ((c = this.bot.client.channels.cache.get('717683408553377815'))) (c as TextChannel).send(getBotReadyAnswer());
  }

  public $error(msg: Message, error: any) {
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
        this.bot.logger.logCommand(msg, args, command);
        const boundThis = Object.assign(msg, { bot: this.bot });
        await (actualCmd.execute.call(boundThis, ...args) as Promise<unknown>)?.catch(error => {
          this.$error(msg, error);
        });
      }
    } catch (error) {
      this.$error(msg, error);
    }
  }

  public async $interaction(i: Interaction) {
    // TODO: have an actually complete system. For now it will only work for games.
    if (i.isButton()) {
      let game;
      if ((game = this.bot.games.find(v => v.channel?.id === i.channelId))) {
        const commandData = Object.assign(i as ButtonInteraction, { bot: this.bot });
        game.$button!(commandData);
      }
    }
  }

  public async $messageCreate(msg: Message) {
    if (!msg.mentions.everyone) {
      if (msg.mentions.has(this.bot.client.user!)) (await msg.react('👋')).message.react(e.id(e.happy));

      if (msg.content.includes('busines')) msg.react(e.id(e.business));
    }

    let game;
    if (
      (game = this.bot.games.find(v => v.channel?.id === msg.channelId)) &&
      [game.challenger.id, game.opponent?.id].includes(msg.author.id)
    ) {
      const commandData = Object.assign(msg, { bot: this.bot });
      try {
        game.$message!(commandData);
      } catch (e: any) {
        this.$error(msg, e);
      }
    } else {
      if (!msg.author.bot && msg.content.startsWith(this.bot.prefix)) await this.$command(msg);
    }
  }
}
