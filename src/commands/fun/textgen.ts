import { MessageEmbedOptions, Util } from "discord.js";
import { Command } from "../../types/command";
const { e } = require('../../vars.json');
const deepai = require('deepai');
const deepai_token : string = process.env.DEEPAI_TOKEN ?? require('../../config.json').deepai;

export = {
    name: 'textgen',
    help: {
        category: 'fun',
        brief: `generats texte !! ${e.shock_handless.e}`,
        usage: 'textGen <text>'
    },
    async execute(message, args) {
        deepai.setApiKey(deepai_token);
        const resp = await (async function() {
            return await deepai.callStandardApi("text-generator", {
                text: Util.cleanContent(args.join(' '), message.channel),
            });
        })();
        const text : string = resp.output ?? `${e.sad.e}`;

        const splitText : string[] = [];
        for(let i = 0 ; i < text.length ; i += 1024) {
            splitText.push(text.slice(i, i + 1024));
        }

        const generateEmbedFields = () => splitText.map((v, i) => { return {
            name: `part ${i+1}/${splitText.length}`,
            value: v,
            inline: true
        };});
        
        const embed = {
            title: 'da generateded text',
            fields: generateEmbedFields()
        } as MessageEmbedOptions;
        
        message.reply({embeds: [embed]});
    }
} as Command;