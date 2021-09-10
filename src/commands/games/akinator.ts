import { AkinatorGame } from "../../types/akinatorGame";
import { Command } from "../../types/command";

export = {
	name: 'akinator',
    aliases: ['aki'],
	help: {
        category: 'games',
		brief: 'strat a new akinetor gaem',
		usage: 'akinator [childMode]'
	},
    execute(message, args, handler) {
        if (handler.games.some(v => v.channel?.id === message.channelId)) throw `der alredi is a gaem in dis chanel !!`;
        let childMode = false;
        if (args.length) {
            if (args[0].toLowerCase() === "childmode") {
                childMode = true;
            }
        }
        handler.games.push(new AkinatorGame(message, childMode));
    },
} as Command;