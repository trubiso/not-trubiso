import { botReadyAnswers, customEmoteRegex, emojiRegex } from './vars';
import { Bot } from './bot';

export function pick(...a: any[] | any[][]) {
    // I love this function, it's so handy
    const arr = a.flat();

    return arr[Math.floor(Math.random() * arr.length)];
}

export function getBotReadyAnswer(): string {
    if (Math.random() > 0.5) return pick(botReadyAnswers.nonSeasonal);

    // get current date
    const now = new Date();

    // reverse the answers so that have the months in descending order,
    // therefore if the current month is e.g. January it sifts through all the other months
    // & realizes that the month is never bigger than them; and if it's December, it sees that
    // the first element's month is already <= the current month.
    const answers = [...botReadyAnswers.seasonal].reverse();

    // get answer for a certain date
    const getAnswerForDate = (d: Date) =>
        answers.find(v =>
        // find element where the month is greater to the current month
            d.getMonth() > v.month - 1 || // v.month - 1 is necessary because Date months are 0-11 whereas seasonal answer months are 1-12
                // or the month is equal & the day is greater or equal
                (d.getMonth() === v.month - 1 && d.getDate() >= v.day))!; // days are the same in both formats tho :D

    let chosen = getAnswerForDate(now);
    if (!chosen) {
        // if we can't find one, it means it's a new year
        now.setMonth(11, 31); // therefore it has to pull from December (of the last year)
        chosen = getAnswerForDate(now);
    }

    return pick(chosen.messages);
}

export function validateCustomEmote(emote: string, bot: Bot): boolean {
    try {
        let e = emote;
        if (emote.includes(':')) e = emote.split(':')[2].slice(0, -1);

        return !!bot.client.emojis.cache.get(e);
    } catch (err) {
        return false;
    }
}

export function containsEmoji(text: string): boolean {
    return !!text.match(emojiRegex);
}

export function smilieEnglish(s: string): string {
    const getRandomExclamationMarks = (num: number): string => {
        let str = '';
        [...new Array(num).keys()].forEach(v => {
            if (v === 0) str += '!';
            else str += Math.random() > Math.random() - v / 10 ? '!' : '1';
        });

        return str;
    };
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const leRegex = new RegExp(`^[${consonants}]+e$`, 'g');
    const fcRegex = new RegExp(`[${consonants}]$`, 'g');
    const ouRegex = new RegExp(`[${consonants}]ou[${consonants}]?`, 'g');
    const vcRegex = /[^a-z-']+/g;

    return s
        .toLowerCase()
        .split(' ')
        .map(v => {
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

            return b.replace(/[!]+/g,
                getRandomExclamationMarks(b
                    .match(/[!]+/g)
                    ?.map(v => v.length)
                    .reduce((a, b) => a + b) ?? 1));
        })
        .join(' ');
}
