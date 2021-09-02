import { Command } from "../../types/command";

const author : string = require('../../vars.json').author;
const e = require('../../vars.json').e;

export = {
	name: 'suggest',
	help: {
        category: 'general',
		brief: 'sugest anythin !!',
		usage: 'suggest <text>'
	},
    async execute(message, args, handler) {
        if (!args.length) {
            throw "gib me somthin to sugest !!";
        }
        const text = args.join(' ');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dm = await handler.client.users.cache.get(author)!.send({content: `You've got mail!`, embeds:[{
            title: 'New suggestion!',
            description: `${message.author.toString()} has suggested: ${text}`
        }]});
        if (dm) {
            message.reply(`just handeded over yur sugestion to trumbinso !`);
        } else {
            message.reply(`somthin went rong... ${e.sad.e}`);
        }
    },
} as Command;