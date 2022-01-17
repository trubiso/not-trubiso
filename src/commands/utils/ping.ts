import { Command } from "../../types/command";

const { e } = require('../../vars.json');

export = {
	name: 'ping',
	help: {
        category: 'utils',
		brief: 'mesurs ze latencie !!',
		usage: 'ping',
	},
	execute(message, args, handler) {
        const embed = {
            title: `${e.happy} ponge !`,
            fields: [
                {
                    name: "latencie",
                    value: `${Date.now() - message.createdTimestamp} milisecondes!`
                },
                {
                    name: "api latencie",
                    value: `${Math.round(handler.client.ws.ping)} milisecondes!`
                }
            ]
        };
        return message.reply({embeds: [embed]});
	}
} as Command;