import { Command } from "../../types/command";
import { Handler } from "../../types/handler";

const Discord = require('discord.js');
const { e } = require('../../vars.json');
const getClosest = require("get-closest");
const Levenshtein = require("levenshtein");

function compareLevenshteinDistance(compareTo: string, baseItem: string) {
    return new Levenshtein(compareTo, baseItem).distance;
}

function find_closest_cmd_to(cmd: string, handler: Handler){
    const cmds = [...handler.commands.map(v => v.name)];
    handler.commands.filter(v => typeof v.aliases !== "undefined").forEach(v => cmds.push(...v.aliases as string[]));
    cmds.push(...handler.categories.map(v => v.name));
    return cmds[getClosest.custom(cmd, cmds, compareLevenshteinDistance)];
}

function get_help(cmd: string, handler: Handler) {
    const out = "";
    const cmdExists = false;
    const prefix = handler.prefix;
    for (const _command of handler.commands){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const command = handler.commands.get(_command[0])!;
        if (command.name === cmd || (command.aliases ?? []).includes(cmd)){
            const embed = {
                title: `help abuot ${prefix}${command.name}`,
                fields: [
                    {
                        name: "brif descreption",
                        value: command.help.brief
                    },
                    {
                        name: "useg",
                        value: `${prefix}${command.help.usage}`,
                        inline: true
                    }
                ]
            };
            if (command.aliases) {
                embed.fields.push({
                    name: "aliasese",
                    value: command.aliases.join(', '),
                    inline: true
                });
            }
            if (command.help.extra) {
                embed.fields.push({
                    name: "moar informetion",
                    value: command.help.extra
                });
            }
            return embed;
        }
    }
    for (const category of handler.categories){
        if (category.name === cmd || category.help.name === cmd){
            const embed = {
                title: `help abuot de ${category.help.name} categori`,
                fields: [
                    {
                        name: "descreption",
                        value: category.help.brief
                    },
                    {
                        name: "comandse",
                        value: category.commands.map(v => v.name).join(', ')
                    }
                ]
            };
            return embed;
        }
    }
    if (cmdExists)
        return out;
    else
        return false;
}

export = {
	name: 'help',
    aliases: ['cmds'],
	help: {
        category: 'general',
		brief: 'shows help for eny comand, categori or just evri comande',
		usage: 'help [command]'
	},
	execute(message, args, handler) {
        let out = "";
		if (!args.length){
            out = "**Commands: **\n\n";
            for (const category of handler.categories.sort((a,b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0))){
                out += `**${category.help.name}: **`;
                for (const command of category.commands){
                    out += `${command.name}, `;
                }
                out = out.slice(0, -2) + "\n";
            }
        } else {
            const cmd = args[0].toString().toLowerCase();
            const ret = get_help(cmd, handler);
            if (ret == false) {
                out = `i culdn't find anythinge for **${cmd}**... ${e.think} did yu meane **${find_closest_cmd_to(cmd, handler)}**?`;
            }
            else if (typeof ret === "string") out = ret;
            else return message.reply({embeds: [ret]});
        }
        return message.reply(Discord.Util.cleanContent(out, message.channel));
	},
} as Command;