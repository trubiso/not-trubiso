import Command from '@core/command';
import { deepAIToken } from '@core/vars';
import { e } from '@core/vars';
import { MessageEmbedOptions, Util } from 'discord.js';
const deepai = require('deepai'); // no es6 module :(

export = {
  name: 'textgen',
  help: {
    brief: `generats texte !! ${e.shock_handless}`,
    usage: '<text>',
    examples: ['anfrica is a niec cnontinent', 'i hab a pen', 'i am a businesman']
  },
  async execute(...text) {
    if (!text.length) throw `com on !! giv me texte !! ${e.sad}`;

    deepai.setApiKey(deepAIToken);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const msg = this; // gotta do this because silly async function

    const resp = await (async function() {
      return await deepai.callStandardApi('text-generator', {
        text: Util.cleanContent(text.join(' '), msg.channel)
      });
    })();
    const respText: string = resp.output ?? `${e.sad}`;

    const splitText: string[] = [];
    for (let i = 0; i < respText.length; i += 1024) splitText.push(respText.slice(i, i + 1024));

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

    this.reply({ embeds: [embed] });
  }
} as Command;
