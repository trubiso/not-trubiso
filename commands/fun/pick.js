const Discord = require('discord.js');
const { e } = require('../../vars.json');

module.exports = {
	name: 'pick',
	help: {
        category: 'fun',
		brief: 'picks betweene elementse !',
		usage: 'pick [element, element, <element>...]',
	},
	execute(message, args, client) {
		if (!args.length) {
			throw "plees, enter elements for me to choos frome !!";
		}
        const arr = args.join(' ').trim().split(',')
        return message.channel.send(`${e.think.e} i picke **${Discord.Util.cleanContent(arr[Math.floor(Math.random() * arr.length)].trim(), message.channel)}**! ${e.happy.e}`);
	}
};