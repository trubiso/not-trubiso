import Command from '@core/command';
import { e, alphabets, alphabetNames, fullAlphabetNames } from '@core/vars';
import { applyPerWord, pick } from '@core/utils';
import { Util } from 'discord.js';

export = {
  name: 'fancify',
  help: {
    category: 'fancify',
    brief: 'fancifies yuor texte',
    usage: '[alphabet] <text> [-list]'
  },
  execute(...args) {
    if (!args.length) throw 'giv me text to fancifie';

    const getSampleOfAlphabet = (i: number) => alphabets[i].split(',').slice(0, 3).join('');

    const regularAlphabet: string[] = alphabets[0].split(',');

    function fancifyWord(word: string, alphabetIdx?: number): string {
      let chosenAlphabet: string[] = [];
      if (alphabetIdx !== undefined) chosenAlphabet = alphabets[alphabetIdx].split(',');
      else chosenAlphabet = pick(alphabets.slice(1)).split(',');
      regularAlphabet.forEach((v, i) => (word = word.replaceAll(v, chosenAlphabet[i])));

      return word;
    }

    if (args[0] === '-list') {
      let out = '**List of alphabets:**\n';
      let nextText = '';
      if (args.length > 1) nextText = args.slice(1).join(' ');
      out += fullAlphabetNames
        .map((v, i) =>
          `${v} (\`${alphabetNames[i]}\`) - ${args.length > 1 ? fancifyWord(nextText, i) : getSampleOfAlphabet(i)}`)
        .join('\n');

      return this.reply(Util.cleanContent(out, this.channel)); // clean da content just in case
    }

    let text = Util.cleanContent(args.join(' ').trim(), this.channel).normalize('NFD'); // normalize to NFD so á becomes a´ and it actually gets fancified.

    if (args.length > 1 && (alphabetNames.includes(args[0]) || args[0] === 'random')) {
      text = text.split(' ').slice(1).join(' '); // remove the alphabet name
      if (args[0] === 'random')
        text = text
          .split('')
          .map(v => fancifyWord(v))
          .join('');
      else
        alphabets[alphabetNames.indexOf(args[0])]
          .split(',')
          .forEach((currentLetter, i) => (text = text.replaceAll(regularAlphabet[i], currentLetter)));
    } else {
      text = applyPerWord(fancifyWord, text);
    }

    if (text.length > 4000) throw `yur text is too bigege !! ${e.sad}`;
    else return this.reply(text);
  }
} as Command;
