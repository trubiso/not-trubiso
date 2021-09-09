import { TextChannel } from "discord.js";
import { Command } from "../../types/command";
import { customEmoteRegex } from "../../utils/customEmoteRegex";

// const { e } = require('../../vars.json');

export = {
	name: 'sendwebhook',
    aliases: ['sw'],
	help: {
        category: 'smilie',
		brief: 'send a webheuk !',
		usage: 'sendwebhook <name> | <avatar URL / emote> | <text>'
	},
    async execute(message, args) {
        if (!args.length || !args.join(' ').split('|').length) {
            throw "chek da usag, mr smili";
        }
        const channel = message.channel as TextChannel;
        const webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.find(v => v.name === "smilie");
        if (!webhook) {
            webhook = await channel.createWebhook("smilie");
        }
        const rawArgs = args.join(' ').split('|').map(v => v.trim());
        const name = rawArgs[0];
        const avatar = rawArgs[1].match(customEmoteRegex) ? "https://cdn.discordapp.com/emojis/" + rawArgs[1].split(':')[2].slice(0, -1) + "?v=1" : rawArgs[1];
        const text = rawArgs[2];
        if (!name || !avatar || !text) {
            throw "giv me apropiet parematers !!";
        }
        await webhook.send({
            username: name,
            avatarURL: avatar,
            content: text
        });
        await message.delete();
    },
} as Command;