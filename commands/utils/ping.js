const Discord = require('discord.js');
const { e } = require('../../vars.json');

module.exports = {
	name: 'ping',
	help: {
        category: 'utils',
		brief: 'mesurs ze latencie !!',
		usage: 'ping',
	},
	execute(message, args, client) {
        const embed = {
            title: `${e.happy.e} ponge !`,
            fields: [
                {
                    name: "latencie",
                    value: `${Date.now() - message.createdTimestamp} milisecondes!`
                },
                {
                    name: "api latencie",
                    value: `${Math.round(client.ws.ping)} milisecondes!`
                }
            ]
        };
        return message.channel.send({embeds: [embed]});
	}
};