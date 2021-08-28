import { Command } from "../../types/command";
const { e } = require('../../vars.json');
const { permissionError } = require('../../utils/permissionError');

export = {
	name: 'test',
	help: {
        category: 'fun',
		brief: 'test comande',
		usage: 'test'
	},
    execute(message, args, handler) {
        permissionError(message);
    },
} as Command;