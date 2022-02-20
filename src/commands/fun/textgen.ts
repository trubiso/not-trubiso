import { MessageEmbedOptions, Util } from 'discord.js';
import Command from '@core/command';
import { deepAIToken } from '@core/vars';
import { e } from '@core/vars';
const deepai = require('deepai');

export = {
    name: 'textgen',
    help: {
        category: 'fun',
        brief: `generats texte !! ${e.shock_handless}`,
        usage: 'textGen <text>'
    },
    async execute(message, args) {
        if (!args.length) throw `com on !! giv me texte !! ${e.sad}`;

        deepai.setApiKey(deepAIToken);
        const resp = await (async function() {
            return await deepai.callStandardApi('text-generator', {
                text: Util.cleanContent(args.join(' '), message.channel)
            });
        })();
        const text: string = resp.output ?? `${e.sad}`;

        const splitText: string[] = [];
        for (let i = 0; i < text.length; i += 1024) splitText.push(text.slice(i, i + 1024));

        const generateEmbedFields = () =>
            splitText.map((v, i) => {
                return {
                    name: `part ${i + 1}/${splitText.length}`,
                    value: v,
                    inline: true
                };
            });

        const embed = {
            title: 'da generateded text',
            fields: generateEmbedFields()
        } as MessageEmbedOptions;

        message.reply({ embeds: [embed] });
    }
} as Command;
