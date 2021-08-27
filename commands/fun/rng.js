const Discord = require('discord.js');
const { e } = require('../../vars.json');

module.exports = {
	name: 'rng',
	aliases: ['random-number'],
	help: {
        category: 'fun',
		brief: 'picks numbr acording to de limits yu giv it !',
		usage: 'rng <max|min, max>',
	},
	execute(message, args, client) {
		min = parseInt(args[1] ? args[0] : 1);
		max = parseInt(((args[1] ?? args[0]) ?? 10)) + 1;
		num = Math.floor(Math.random() * (max - min)) + min;
		if (args.length > 2) {
			throw "yu gaev me too meny arguments !!";
		}
        return message.reply(`${e.think.e} i picke **${num}**! ${e.happy.e}`);
	}
};