import { Util } from "discord.js";
import { Command } from "../../types/command";
import { customEmoteRegex } from "../../utils/customEmoteRegex";
import { containsEmoji } from "../../utils/containsEmoji";

const smilieEnglish = (s : string) : string => {
    const getRandomExclamationMarks = (num : number) : string => {
        let str = "";
        [...new Array(num).keys()].forEach(v => {
            if (v === 0) str += "!";
            else str += Math.random() > (Math.random() - v/10) ? "!" : "1"
        });
        return str;
    }
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const fcRegex = new RegExp(`[${consonants}]\$`,'g');
    const ouRegex = new RegExp(`[${consonants}]ou[${consonants}]?`,'g');
    return s.toLowerCase().split(' ').map(v => {
        if (v.match(customEmoteRegex) || containsEmoji(v)) return v;
        let r = v.replace(/[^a-z']+/g, '');
        r = r.replace(/'/g, '');
        r = r.replace(/ei/g, 'ie');
        if (Math.random() < 0.3) r = r.replace(/e$/g, '');
        if (r.endsWith('ed')) r += 'ed';
        if (r.match(fcRegex) && Math.random() > 0.6) r += 'e';
        r.match(ouRegex)?.forEach(y => {
            r = r.replace(y, y.replace(/ou/g, 'u'));
        });
        r.match(/[aeiou]gg[aeiou]/g)?.forEach(y => {
            r = r.replace(y, y.replace(/gg/g, 'g'));
        });
        const b = r + (v.match(/[^a-z']+/) ?? []).join(' ');
        return b.replace(/[!]+/g, getRandomExclamationMarks(b.match(/[!]+/g)?.map(v => v.length).reduce((a,b)=>a+b) ?? 1));
    }).join(' ');
};

export = {
	name: 'translatealg',
	help: {
        category: 'fun',
		brief: 'translatese to smili englisheshe usinge an algroithm !',
		usage: 'translatealg <text>'
	},
    execute(message, args) {
        if (!args.length) {
            throw "gib me text to translat !!";
        }
        let text = args.join(' ').toLowerCase();
        text = smilieEnglish(text);
        message.reply(Util.cleanContent(text, message.channel));
    },
} as Command;