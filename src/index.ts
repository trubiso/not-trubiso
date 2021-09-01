import { Client, Collection, Message, MessageReaction, TextChannel } from "discord.js";
import fs from "fs";
import { loadModule } from "./utils/loadModule";
import { Handler } from "./types/handler";
import { Poll } from "./types/poll";
import chalk from "chalk";
import { handleCommand } from "./utils/handleCommand";
import { logError } from "./utils/logError";
import { findPollMessages } from "./utils/findPollMessages";

const token : string = process.env.NT_TOKEN ?? require('./config.json').token;
const { e } = require('./vars.json');

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"], allowedMentions: {repliedUser: false}});
const handler = new Handler(new Collection(), [], "<", client, []);

const categoryFiles = fs.readdirSync('./categories').filter((file: string) => file.endsWith('.js'));
categoryFiles.forEach(file => loadModule(file, handler));

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (client.guilds.cache.get("717683408012181505")) (client.channels.cache.get("717683408553377815")! as TextChannel).send(`i'm bakke!!! ${e.happy.e}`);
    client.user?.setPresence({ activities: [{ name: "yu !!", type: "LISTENING" }]});
    findPollMessages(handler).then(v => {
        const restoredPolls = v.map(v => Poll.restorePollFromMessage(v));
        const verifiedRestoredPolls = restoredPolls.filter(Boolean) as Poll[];
        handler.polls.push(...verifiedRestoredPolls);
        console.log(chalk.green(`Restored ${verifiedRestoredPolls.length} polls.`));
    });
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

    if (!msg.author.bot && msg.content.startsWith(handler.prefix)) {
        await handleCommand(msg, handler);
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pollReactionBehavior = (reaction: any) : void => handler.polls.forEach(v => v.updateMessage(reaction as MessageReaction));

client.on('messageReactionAdd', pollReactionBehavior);
client.on('messageReactionRemove', pollReactionBehavior);

process.on('unhandledRejection', logError);

client.login(token);