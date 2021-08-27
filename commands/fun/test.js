const { e } = require('../../vars.json');
const answers = require('../../vars.js').permission_denied_answers;

module.exports = {
	name: 'test',
	help: {
        category: 'fun',
		brief: 'test comande',
		usage: 'test'
	},
    execute(message, args, client) {
        let answer_pos = Math.floor(Math.random()*answers.length);
        let answer = answers[answer_pos];
        message.reply(answer);
    },
};