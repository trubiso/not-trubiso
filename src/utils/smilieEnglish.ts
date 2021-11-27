import { customEmoteRegex } from "./customEmoteRegex";
import { containsEmoji } from "./containsEmoji";

export default (s : string) : string => {
    const getRandomExclamationMarks = (num : number) : string => {
        let str = "";
        [...new Array(num).keys()].forEach(v => {
            if (v === 0) str += "!";
            else str += Math.random() > (Math.random() - v/10) ? "!" : "1";
        });
        return str;
    };
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const leRegex = new RegExp(`^[${consonants}]+e$`,'g');
    const fcRegex = new RegExp(`[${consonants}]$`,'g');
    const ouRegex = new RegExp(`[${consonants}]ou[${consonants}]?`,'g');
    const vcRegex = /[^a-z-']+/g;
    return s.toLowerCase().split(' ').map(v => {
        if (v.match(customEmoteRegex) || containsEmoji(v)) return v;
        let r = v.replace(vcRegex, '');
        r = r.replace(/'/g, '');
        r = r.replace(/ei/g, 'ie');
        if (Math.random() < 0.3 && !r.match(leRegex)) r = r.replace(/e$/g, '');
        if (r.endsWith('ed')) r += 'ed';
        if (r.match(fcRegex) && Math.random() > 0.6) r += 'e';
        r.match(ouRegex)?.forEach(y => {
            r = r.replace(y, y.replace(/ou/g, 'u'));
        });
        r.match(/[aeiou]gg[aeiou]/g)?.forEach(y => {
            r = r.replace(y, y.replace(/gg/g, 'g'));
        });
        r = r.replace(/ce$/, 's');
        r = r.replace(/ye$/, 'ie');
        const b = r + (v.match(vcRegex) ?? []).join(' ');
        return b.replace(/[!]+/g, getRandomExclamationMarks(b.match(/[!]+/g)?.map(v => v.length).reduce((a,b)=>a+b) ?? 1));
    }).join(' ');
};