const { e } = require('../../vars.json');
module.exports = {
	name: 'ping',
	help: {
        category: 'utils',
		brief: 'Gets the ping',
		usage: 'ping',
	},
	execute(message, args, client) {
		// if (!args.length)
        //     throw "You must input an equation.";
		return message.channel.send(`im hungri !! ${e.sad.e}`);
	}
};