import { Client, Collection, Interaction, Message, TextChannel } from "discord.js";
import fs from "fs";
import { loadModule } from "./utils/loadModule";
import { Handler } from "./types/handler";
import { handleCommand } from "./utils/handleCommand";
import { logError } from "./utils/logError";

const token : string = process.env.NT_TOKEN ?? require('./config.json').token;
const { e } = require('./vars.json');

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"], allowedMentions: {repliedUser: false}});
const handler = new Handler(new Collection(), [], "<", client, [], []);

const categoryFiles = fs.readdirSync('./categories').filter((file: string) => file.endsWith('.js'));
categoryFiles.forEach(file => loadModule(file, handler));

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (client.guilds.cache.get("717683408012181505")) (client.channels.cache.get("717683408553377815")! as TextChannel).send(`i'm bakke!!! ${e.happy.e}`);
    client.user?.setPresence({ activities: [{ name: "yu !!", type: "LISTENING" }]});
});

client.on('guildMemberAdd', member => {
    if (member.guild.id === '717683408012181505') {
        const r = ['725843105445576796', '725843316662468641'];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member.roles.add(client.guilds.cache.get('717683408012181505')!.roles.resolve(r[Math.floor(Math.random() * r.length)])!);
    }
});

client.on('messageCreate', async (msg: Message) => {
    if (!msg.mentions.everyone) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (msg.mentions.has(client.user!)) {
            msg.react("👋");
            msg.react(e.happy.id);
        }
        if (msg.content.includes("busines")) {
            msg.react(e.business.id);
        }
    }

    if (handler.games.some(v => v.channel?.id === msg.channelId)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const game = handler.games.find(v => v.channel?.id === msg.channelId)!;
        if (game.handleMessage) {
            if (msg.author.id === game.challenger.user.id || msg.author.id === game.opponent?.user.id) {
                game.handleMessage(msg, handler);
            } else if (!msg.author.bot && msg.content.startsWith(handler.prefix)) {
                await handleCommand(msg, handler);
            }
        } else {
            await handleCommand(msg, handler);
        }
    } else if (!msg.author.bot && msg.content.startsWith(handler.prefix)) {
        await handleCommand(msg, handler);
    }
});

const execInteraction = async (interactionElem : 'button' | 'selectMenu', interaction : Interaction) : Promise<void> => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return undefined;
    switch (interactionElem) {
    case 'button':
        if (!interaction.isButton()) return; break;
    case 'selectMenu':
        if (!interaction.isSelectMenu()) return; break;
    }
    const execCmd = async () => {
        const cmd = interaction.customId.split('_')[0];
        const actualCmd = handler.commands.find(v => v.name === cmd);
        if (actualCmd) {
            switch (interactionElem) {
            case 'button':
                if (!interaction.isButton()) return;
                if (!actualCmd.handleButton) return;
                else await (actualCmd.handleButton(interaction, handler) as Promise<unknown>)?.catch(error => { logError(error); }); break;
            case 'selectMenu':
                if (!interaction.isSelectMenu()) return;
                if (!actualCmd.handleSelectMenu) return;
                else await (actualCmd.handleSelectMenu(interaction, handler) as Promise<unknown>)?.catch(error => { logError(error); }); break;
            }
        }
    };
    if (handler.games.some(v => v.channel?.id === interaction.channelId)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const game = handler.games.find(v => v.channel?.id === interaction.channelId)!;
        if (interaction.user.id === game.challenger.user.id || interaction.user.id === game.opponent?.user.id) {
            switch (interactionElem) {
            case 'button':
                if (!interaction.isButton()) return;
                if (!game.handleButton) return;
                else game.handleButton(interaction, handler); break;
            case 'selectMenu':
                if (!interaction.isSelectMenu()) return;
                if (!game.handleSelectMenu) return;
                else game.handleSelectMenu(interaction, handler); break;
            }
        } else await execCmd();
    } else {
        await execCmd();
    }
};

client.on('interactionCreate', async (interaction : Interaction) => {
    if (interaction.isButton()) {
        execInteraction("button", interaction);
    } else if (interaction.isSelectMenu()) {
        execInteraction("selectMenu", interaction);
    }
});

process.on('unhandledRejection', logError);

client.login(token);