import { botReadyAnswers, customEmoteRegex, emojiRegex } from './vars';
import Bot from '@core/bot';
export function pick(...a: any[] | any[][]) {
  // I love this function, it's so handy
  const arr = a.flat();

  return arr[Math.floor(Math.random() * arr.length)];
}

export function repeat(func: CallableFunction, times: number) {
  [...Array(times).keys()].forEach(v => func(v));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function applyPerWord(func: (v: string) => string, words: string) {
  return words
    .split(' ')
    .map(v =>
      v
        .split('\n')
        .map(w => func(w))
        .join('\n'))
    .join(' ');
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

export function karlgorithm<T>(cpPos: number[], cpPlacedBy: T, grid: T[][], n: number, winning: T): boolean {
  // welcome to the karlgorithm

  // the directions that the traverser will go in
  const directions = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1]
  ];

  // each direction will have an IDirObj object that will be used to keep track of
  // how many pieces / what pieces there are to each direction of the current pos
  interface IDirObj {
    direction: number[];
    piecesFound: number;
    piecesFoundArr: number[][];
  }

  // an axis is 2 opposite directions together. eg [1, 0] & [-1, (-)0] is an axis
  interface IAxis {
    directions: number[][];
    piecesFound: number;
    piecesFoundArr: number[][];
  }

  // the direction objects
  const dirObjs = directions.map(v => {
    return {
      direction: v,
      piecesFound: 0,
      piecesFoundArr: []
    } as IDirObj;
  });

  let pos = [...cpPos];

  // these eslint rules are disabled just because eslint does not want me to have a while(true)
  // eslint-disable-next-line curly
  for (const direction of directions) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      pos[0] += direction[0];
      pos[1] += direction[1];
      if (grid[pos[1]] !== undefined && grid[pos[1]][pos[0]] === cpPlacedBy) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dirObj = dirObjs.find(v => v.direction === direction)!;
        dirObj.piecesFound++;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        dirObj.piecesFoundArr.push([pos[1], pos[0]]);
      } else {
        pos = [cpPos[0], cpPos[1]];
        break;
      }
    }
  }

  const axis = directions.slice(0, 4).map(v => {
    return {
      directions: [v, [v[0] === 0 ? 0 : -v[0], v[1] === 0 ? 0 : -v[1]]],
      piecesFound: 0
    };
  });
  const processedAxis = axis.map(v => {
    const a = dirObjs.filter(a => v.directions.some(i => i[0] === a.direction[0] && i[1] === a.direction[1]));

    return {
      directions: v.directions,
      piecesFound: a[0].piecesFound + a[1].piecesFound,
      piecesFoundArr: [...a[0].piecesFoundArr, ...a[1].piecesFoundArr]
    } as IAxis;
  });
  for (const paxis of processedAxis)
    if (paxis.piecesFound > n - 2) {
      const what = [...paxis.piecesFoundArr, cpPos];
      what.forEach(v => (grid[v[1]][v[0]] = winning));

      return true;
    }

  return false;
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
