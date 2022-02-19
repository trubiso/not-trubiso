import { Command } from './command';

export type Module = {
    name: string,
    help: {
        name: string,
		brief: string
	},
    commands: Command[]
}