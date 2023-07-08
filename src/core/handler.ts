import Bot from '@core/bot';
import { getBotReadyAnswer, pick } from '@core/utils';
import { e } from '@core/vars';
import { ButtonInteraction, GuildMember, Interaction, Message, SelectMenuInteraction, TextChannel } from 'discord.js';

export default class Handler {
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  public $ready(isDev = false) {
    console.log(`Logged in as ${this.bot.client.user?.tag}!`);
    this.bot.client.user?.setPresence({ activities: [{ name: 'you :-)', type: 'WATCHING' }] });

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

    if (i.isSelectMenu()) {
      let game;
      if ((game = this.bot.games.find(v => v.channel?.id === i.channelId))) {
        const commandData = Object.assign(i as SelectMenuInteraction, { bot: this.bot });
        game.$selectMenu!(commandData);
      }
    }
  }

  public async $messageCreate(msg: Message) {
    if (!msg.mentions.everyone) {
      // automatic reactions
      // the functions may seem messy, but we have to preserve the order of the reactions
      // and putting the code outside the function will make not trubiso wait before he
      // can even execute the command which is dumb, so i just have an async function I
      // don't await.
      if (msg.mentions.has(this.bot.client.user!))
        (async() => {
          await msg.react('👋');
          await msg.react(e.id(e.happy));
        })();

      if (msg.content.includes('busines')) msg.react(e.id(e.business));

      // TONGUE REACTIONS

      // opposite tongues are important
      // we have to do it this way so that the tongues aren't opposite to each other,
      // since they have to be licking each other
      if (msg.content.includes(e.tongue_right) && msg.content.includes(e.tongue_left))
        (async() => {
          await msg.react(e.id(e.tongue_left));
          await msg.react(e.id(e.tongue_right));
          await msg.react(e.id(e.lik));
        })();
      // why is this an else? to guarantee that the tongues are together and then they
      // lik in case of having both tongue left and tongue right, otherwise we could
      // have a disaster where the tongues don't lick (very sad)
      else if (msg.content.includes(e.lik))
        (async() => {
          await msg.react(e.id(e.tongue_left));
          await msg.react(e.id(e.tongue_right));
        })();
      else if (msg.content.includes(e.tongue_right)) msg.react(e.id(e.tongue_left));
      else if (msg.content.includes(e.tongue_left)) msg.react(e.id(e.tongue_right));
    }

    let game;
    if (
      (game = this.bot.games.find(v => v.channel?.id === msg.channelId)) &&
      ([game.challenger.id, game.opponent?.id].includes(msg.author.id) || game.wantsAllMessages)
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
