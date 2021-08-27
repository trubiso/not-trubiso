const Discord = require('discord.js');
const { e } = require('../../vars.json');
var getClosest = require("get-closest");
var Levenshtein = require("levenshtein");

function compareLevenshteinDistance(compareTo, baseItem) {
    return new Levenshtein(compareTo, baseItem).distance;
}

module.exports = {
	name: 'help',
    aliases: ['cmds'],
	help: {
        category: 'general',
		brief: 'shows help for eny comand, categori or just evri comande',
		usage: 'help [command]'
	},
    find_closest_cmd_to(cmd, client){
        let cmds = [...client.commands.map(v => v.name)]
        client.commands.filter(v => v.aliases).forEach(v => cmds.push(...v.aliases))
        cmds.push(...client.categories.map(v => v.name))
        return cmds[getClosest.custom(cmd, cmds, compareLevenshteinDistance)];
    },
    get_help(cmd, client) {
        let out = ""
        let cmdExists = false;
        let prefix = client.prefix
        for (_command of client.commands){
            const command = client.commands.get(_command[0]);
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
        for (category of client.categories){
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
    },
	execute(message, args, client) {
        out = "";
		if (!args.length){
            out = "**Commands: **\n\n";
            for (category of client.categories){
                out += `**${category.help.name}: **`
                for (command of category.commands){
                    out += `${command.name}, `;
                }
                out = out.slice(0, -2) + "\n";
            }
        } else {
            const cmd = args[0].toString().toLowerCase();
            let ret = this.get_help(cmd, client);
            if (ret == false) {
                out = `i culdn't find anythinge for **${cmd}**... ${e.think.e}` + `did yu meane **${this.find_closest_cmd_to(cmd, client)}**?`;
            }
            else if (typeof ret === "string") out = ret;
            else return message.channel.send({embeds: [ret]});
        }
        return message.channel.send(Discord.Util.cleanContent(out, message.channel));
	},
};