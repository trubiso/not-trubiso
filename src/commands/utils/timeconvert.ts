import { Util } from "discord.js";
import { Command } from "../../types/command";
const { e } = require('../../vars.json');

export = {
	name: 'timeconvert',
    aliases: ['tc'],
	help: {
        category: 'utils',
		brief: 'i convert da tiem !',
		usage: 'timeconvert <time (hh:mm)> <source timezone> [destination timezone (defaults to CET)]'
	},
    execute(message, args) {
        if (!args.length || !args[0] || !args[1]) throw "yu dum grangobu !! giv me da proper argumentse !";
        const a = args.slice(1);
        if (!a[1]) a.push('CET');
        const times = a.map(v => {
            const gmtMatch = v.toUpperCase().match(/GMT[+-]{1}[1]?[0-9]{1}/g);
            if (gmtMatch) {
                return parseInt(gmtMatch[0].replaceAll('GMT', ''));
            }
            else if (v.toUpperCase() === "CET" || v.toUpperCase() === "CEST") return 2;
            else if (v.toUpperCase() === "EST") return -4;
            else return 0;
        });

        const timeDifference = times[1] - times[0];
        const hour = parseInt(args[0].split(':')[0]);
        const newHour = hour + timeDifference;
        let processedHour = newHour;
        let dDiff = 0;
        if (newHour < 0 ) { processedHour = newHour + 24; dDiff--; }
        if (newHour > 24) { processedHour = newHour - 24; dDiff++; }
        const dateString = `${dDiff === -1 ? "yesterdey at " : (dDiff === 1 ? "tumoro at " : "")}${processedHour}:${args[0].split(':')[1] ?? "00"}`;

        message.reply(Util.cleanContent(`after som hevi calculenting ${e.tribaldance} i conclud dat da result is **${dateString}**`, message.channel));
    },
} as Command;