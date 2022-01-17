import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'randomcolor',
    aliases: ['rc'],
	help: {
        category: 'random',
		brief: 'randome colorere',
		usage: 'randomcolor'
	},
    execute(message) {
        const color = (Math.random() * 0xfffff * 1000000).toString(16).slice(1, 7);
        message.reply({embeds: [{
            title: `random colore !! ${e.shock_handless.e}`,
            description: `i chosese #${color} ${e.happy}`,
            color: `#${color}`
        }]});
    },
} as Command;