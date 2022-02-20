import { Util } from 'discord.js';
import Command from '@core/command';
import { e, alphabets, alphabetNames, fullAlphabetNames } from '@core/vars';

export = {
    name: 'fancify',
    help: {
        category: 'fancify',
        brief: 'fancifies yuor texte',
        usage: 'fancify [alphabet] <text> [-list]'
    },
    execute(...args) {
        if (!args.length) throw 'giv me text to fancifie';

        if (args.includes('-list')) {
            let out = '**List of alphabets:**';
            (fullAlphabetNames as string[]).forEach((v, i) => {
                out += `\n${v} (\`${alphabetNames[i]}\`) - ${alphabets[i].split(',').slice(0, 3).join('')}`;
            });

            return this.reply(Util.cleanContent(out, this.channel)); // clean da content just in case
        }

        function fancifyWord(word: string): string {
            const c: string[] = alphabets[Math.floor(Math.random() * (alphabets.length - 1) + 1)].split(',');
            const a: string[] = alphabets[0].split(',');
            let o = word;
            a.forEach((v, i) => (o = o.replaceAll(v, c[i])));

            return o;
        }

        let text = Util.cleanContent(args.join(' ').trim(), this.channel);
        if (alphabetNames.includes(args[0])) {
            text = text.split(' ').slice(1).join(' ');
            (alphabets[alphabetNames.indexOf(args[0])].split(',') as string[]).forEach((v, i) => (text = text.replaceAll(alphabets[0].split(',')[i], v)));
        } else {
            text = text
                .split(' ')
                .map(v =>
                    v
                        .split('\n')
                        .map(w => fancifyWord(w))
                        .join('\n'))
                .join(' ');
        }

        if (text.length > 4000) throw `yur text is too bigege !! ${e.sad}`;
        else return this.reply(text);
    }
} as Command;
