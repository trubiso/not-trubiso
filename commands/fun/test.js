const { e } = require('../../vars.json');
const answers = require('../../vars.js').permission_denied_answers;
const { permissionError } = require('../../utils/permissionError.js');

module.exports = {
	name: 'test',
	help: {
        category: 'fun',
		brief: 'test comande',
		usage: 'test'
	},
    execute(message, args, client) {
        permissionError(message);
    },
};