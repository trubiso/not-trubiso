import { botReadyAnswers, customEmoteRegex } from './vars';
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

export function getBotReadyAnswer(n?: number): string {
  if (n && n < botReadyAnswers.nonSeasonal.length) return botReadyAnswers.nonSeasonal[n];
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

  if (n) {
    const newN = n - botReadyAnswers.nonSeasonal.length;
    return chosen[newN];
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

export function karlgorithm<T>(lastPiecePos: number[], lastPieceOwner: T, grid: T[][], n: number, winning: T): boolean {
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
  const directionObjects = directions.map(v => {
    return {
      direction: v,
      piecesFound: 0,
      piecesFoundArr: []
    } as IDirObj;
  });

  let currentPos = [...lastPiecePos];

  // these eslint rules are disabled just because eslint does not want me to have a while(true)
  // eslint-disable-next-line curly
  for (const direction of directions) {
    // (we have a break to stop the loop)
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // move to that direction
      currentPos[0] += direction[0];
      currentPos[1] += direction[1];

      // if we're out of bounds, or if I didn't place that, break
      if (grid[currentPos[0]] !== undefined && grid[currentPos[0]][currentPos[1]] === lastPieceOwner) {
        const directionObject = directionObjects.find(v => v.direction === direction)!;
        directionObject.piecesFound++;
        directionObject.piecesFoundArr.push(currentPos);
      } else {
        // and reset the current pos to the proper one
        currentPos = [...lastPiecePos];
        break;
      }
    }
  }

  const axes = directions.slice(0, 4).map(v => {
    return {
      directions: [v, [-v[0], -v[1]]],
      piecesFound: 0
    };
  });

  const processedAxes = axes.map(v => {
    const axisObjects = directionObjects.filter(w =>
      v.directions.some(b => b[0] === w.direction[0] && b[1] === w.direction[1]));

    return {
      directions: v.directions,
      piecesFound: axisObjects[0].piecesFound + axisObjects[1].piecesFound,
      piecesFoundArr: [...axisObjects[0].piecesFoundArr, ...axisObjects[1].piecesFoundArr]
    } as IAxis;
  });

  console.log(processedAxes.map(v => v.piecesFoundArr), processedAxes.map(v => v.piecesFound));
  for (const currentAxis of processedAxes)
    if (currentAxis.piecesFound > n - 2) {
      const correctAxis = [...currentAxis.piecesFoundArr, lastPiecePos];
      correctAxis.forEach(v => (grid[v[0]][v[1]] = winning));

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
      if (v.match(customEmoteRegex)) return v;
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
