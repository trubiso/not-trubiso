import { Util } from 'discord.js';
import Command from '@core/command';
import { e, alphabets, alphabetNames, fullAlphabetNames } from '@core/vars';
import { applyPerWord, pick } from '@core/utils';

export = {
  name: 'fancify',
  help: {
    category: 'fancify',
    brief: 'fancifies yuor texte',
    usage: 'fancify [alphabet] <text> [-list]'
  },
  execute(...args) {
    if (!args.length) throw 'giv me text to fancifie';

    const getSampleOfAlphabet = (i: number) => alphabets[i].split(',').slice(0, 3).join('');

    if (args.includes('-list')) {
      let out = '**List of alphabets:**\n';
      out += fullAlphabetNames.map((v, i) => `${v} (\`${alphabetNames[i]}\`) - ${getSampleOfAlphabet(i)}`).join('\n');

      return this.reply(Util.cleanContent(out, this.channel)); // clean da content just in case
    }

    const regularAlphabet: string[] = alphabets[0].split(',');

    function fancifyWord(word: string): string {
      const chosenAlphabet: string[] = pick(alphabets.slice(1)).split(',');
      regularAlphabet.forEach((v, i) => (word = word.replaceAll(v, chosenAlphabet[i])));

      return word;
    }

    let text = Util.cleanContent(args.join(' ').trim(), this.channel);

    if (alphabetNames.includes(args[0])) {
      text = text.split(' ').slice(1).join(' '); // remove the alphabet name
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
