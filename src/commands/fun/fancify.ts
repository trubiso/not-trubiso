import Command from '@core/command';
import { e, alphabets, alphabetNames, fullAlphabetNames } from '@core/vars';
import { applyPerWord, pick } from '@core/utils';
import { Util } from 'discord.js';

export = {
  name: 'fancify',
  help: {
    brief: 'fancifies yuor texte',
    usage: '[alphabet] <text> [-list]'
  },
  execute(...text) {
    if (!text.length) throw 'giv me text to fancifie';

    const getSampleOfAlphabet = (i: number) => alphabets[i].split(',').slice(0, 3).join('');

    const regularAlphabet: string[] = alphabets[0].split(',');

    function fancifyWord(word: string, alphabetIdx?: number): string {
      let chosenAlphabet: string[] = [];
      if (alphabetIdx !== undefined) chosenAlphabet = alphabets[alphabetIdx].split(',');
      else chosenAlphabet = pick(alphabets.slice(1)).split(',');
      regularAlphabet.forEach((v, i) => (word = word.replaceAll(v, chosenAlphabet[i])));

      return word;
    }

    if (text[0] === '-list') {
      let out = '**List of alphabets:**\n';
      let nextText = '';
      if (text.length > 1) nextText = text.slice(1).join(' ');
      out += fullAlphabetNames
        .map((v, i) =>
          `${v} (\`${alphabetNames[i]}\`) - ${text.length > 1 ? fancifyWord(nextText, i) : getSampleOfAlphabet(i)}`)
        .join('\n');

      return this.reply(Util.cleanContent(out, this.channel)); // clean da content just in case
    }

    let normalisedText = Util.cleanContent(text.join(' ').trim(), this.channel).normalize('NFD'); // normalize to NFD so á becomes a´ and it actually gets fancified.

    if (text.length > 1 && (alphabetNames.includes(text[0]) || text[0] === 'random')) {
      normalisedText = normalisedText.split(' ').slice(1).join(' '); // remove the alphabet name
      if (text[0] === 'random')
        normalisedText = normalisedText
          .split('')
          .map(v => fancifyWord(v))
          .join('');
      else
        alphabets[alphabetNames.indexOf(text[0])]
          .split(',')
          .forEach((currentLetter, i) => (normalisedText = normalisedText.replaceAll(regularAlphabet[i], currentLetter)));
    } else {
      normalisedText = applyPerWord(fancifyWord, normalisedText);
    }

    if (normalisedText.length > 4000) throw `yur text is too bigege !! ${e.sad}`;
    else return this.reply(normalisedText);
  }
} as Command;
