import { Client, Collection, Message, TextChannel } from "discord.js";

import fs from "fs";

const { token } = require('./config.json');
const { e } = require('./vars.json');

import { loadModule } from "./utils/loadModule";

import { Command } from "./types/command";
import { Handler } from "./types/handler";

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"], allowedMentions: {parse: ["users"], repliedUser: false}});
const handler = new Handler(new Collection(), [], "<", client);

const categoryFiles = fs.readdirSync('./categories').filter((file: string) => file.endsWith('.js'));

for (const file of categoryFiles) {
    loadModule(file, handler);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (client.channels.cache.get("717683408553377815")! as TextChannel).send(`i'm bakke!!! ${e.happy.e}`);
});

client.on('messageCreate', (msg: Message) => {
    if (!msg.content.startsWith(handler.prefix) && !msg.mentions.everyone) {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            msg.channel.send(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} ${(error as any).toString()}`);
        }
    }
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(token);