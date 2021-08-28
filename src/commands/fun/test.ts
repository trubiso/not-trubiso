import { Command } from "../../types/command";
const { permissionError } = require('../../utils/permissionError');

export = {
	name: 'test',
	help: {
        category: 'fun',
		brief: 'test comande',
		usage: 'test'
	},
    execute(message) {
        permissionError(message);
    },
} as Command;