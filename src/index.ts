import { Client, Collection, Message, MessageReaction, TextChannel } from "discord.js";

import fs from "fs";

const token : string = process.env.NT_TOKEN ?? require('./config.json').token;
const { e } = require('./vars.json');

import { loadModule } from "./utils/loadModule";

import { Command } from "./types/command";
import { Handler } from "./types/handler";
import { Poll } from "./types/poll";

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"], allowedMentions: {repliedUser: false}});
const handler = new Handler(new Collection(), [], "<", client, []);

const categoryFiles = fs.readdirSync('./categories').filter((file: string) => file.endsWith('.js'));

for (const file of categoryFiles) {
    loadModule(file, handler);
}

//for (const message of )
async function findPollMessages() {
    const textChannels = handler.client.channels.cache.filter(v => v.isText());
    const messages = await Promise.all(textChannels.map(async v => await (v as TextChannel).messages.fetch({
        limit: 100
    }).then(messages => {
        const botMessages = [...messages.filter(v => v.author.id === client.user?.id).values()];
        return botMessages.filter(v => !!v.embeds).filter(v => v.embeds[0]?.title === `polle !! ${e.shock_handless.e}`);
    })));
    const messageArr = messages.filter(v => v.length).flat(1);
    return messageArr;
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (client.channels.cache.get("717683408553377815")! as TextChannel).send(`i'm bakke!!! ${e.happy.e}`);
    client.user?.setPresence({
        activities: [{
            name: "yu !!",
            type: "LISTENING"
        }]
    });
    findPollMessages().then(v => {
        const restoredPolls = v.map(v => Poll.restorePollFromMessage(v));
        handler.polls.push(...restoredPolls.filter(Boolean) as Poll[]);
    }).then(() => {
        // console.log(handler.polls.map(v => {return {pollOptions: v.pollOptions.map(v => `${v.emojiId} -> ${v.count}`), message: v.message.url}; }));
    });
});

client.on('messageCreate', (msg: Message) => {
    if (!msg.mentions.everyone) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (msg.mentions.has(client.user!)) {
            msg.react("👋");
            msg.react(e.happy.id);
        }
        if (msg.content.includes("busines")) {
            msg.react(e.business.id);
        }
        return;
    } else if (!msg.author.bot && msg.content.startsWith(handler.prefix)) {
        const args = msg.content.slice(handler.prefix.length).trim().split(/ +/);
        const command = args.shift()?.toLowerCase() ?? "";

        try {
            if (handler.commands.get(command)) {
                handler.commands.get(command)?.execute(msg, args, handler);
            } else {
                const suitable = [...handler.commands.filter((v: Command) => (v.aliases ?? []).includes(command))];
                if (suitable) {
                    suitable[0][1]?.execute(msg, args, handler);
                }
            }
        } catch (error) {
            if (!(error instanceof TypeError)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                msg.channel.send(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} ${(error as any).toString()}`);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (handler.commands.get(command)) console.log((error as any).toString());
            }
        }
    }
});

client.on('messageReactionAdd', reaction => {
    handler.polls.forEach(v => v.updateMessage(reaction as MessageReaction));
});

client.on('messageReactionRemove', reaction => {
    handler.polls.forEach(v => v.updateMessage(reaction as MessageReaction));
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(token);