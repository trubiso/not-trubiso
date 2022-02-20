import Bot from '@core/bot';
import Command from '@core/command';
import { Util } from 'discord.js';
import Levenshtein from 'levenshtein';
import { e } from '@core/vars';

const getClosest = require('get-closest');

export = {
    name: 'help',
    aliases: ['cmds'],
    help: {
        category: 'general',
        brief: 'shows help for eny comand, categori or just evri comande',
        usage: 'help [command]'
    },
    execute(message, args, bot) {
        const compareLevenshteinDistance = (compareTo: string, baseItem: string) =>
            new Levenshtein(compareTo, baseItem).distance;

        function findClosestCmdTo(cmd: string, bot: Bot) {
            const cmds = [...bot.commands.map(v => v.name)];
            bot.commands
                .filter(v => typeof v.aliases !== 'undefined')
                .forEach(v => cmds.push(...(v.aliases as string[])));
            cmds.push(...bot.categories.map(v => v.name));

            return cmds[getClosest.custom(cmd, cmds, compareLevenshteinDistance)];
        }

        function getHelp(cmd: string, bot: Bot) {
            const out = '';
            const cmdExists = false;
            const prefix = bot.prefix;
            for (const commandName of bot.commands) {
                const command = bot.commands.get(commandName[0])!;
                if (command.name === cmd || command.aliases?.includes(cmd)) {
                    const embed = {
                        title: `help abuot ${prefix}${command.name}`,
                        fields: [
                            {
                                name: 'brif descreption',
                                value: command.help.brief
                            },
                            {
                                name: 'useg',
                                value: `${prefix}${command.help.usage}`,
                                inline: true
                            }
                        ]
                    };

                    if (command.aliases)
                        embed.fields.push({
                            name: 'aliasese',
                            value: command.aliases.join(', '),
                            inline: true
                        });

                    if (command.help.extra)
                        embed.fields.push({
                            name: 'moar informetion',
                            value: command.help.extra
                        });

                    return embed;
                }
            }

            for (const category of bot.categories)
                if (category.name === cmd || category.help.name === cmd) {
                    const embed = {
                        title: `help abuot de ${category.help.name} categori`,
                        fields: [
                            {
                                name: 'descreption',
                                value: category.help.brief
                            },
                            {
                                name: 'comandse',
                                value: category.commands.map(v => v.name).join(', ')
                            }
                        ]
                    };

                    return embed;
                }

            if (cmdExists) return out;
            else return false;
        }

        let out = '';
        if (!args.length) {
            out = '**Commands: **\n\n';
            for (const category of bot.categories.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))) {
                out += `**${category.help.name}: **`;
                for (const command of category.commands) out += `${command.name}, `;

                out = `${out.slice(0, -2)}\n`;
            }
        } else {
            const cmd = args[0].toString().toLowerCase();
            const ret = getHelp(cmd, bot);
            if (ret === false)
                out = `i culdn't find anythinge for **${cmd}**... ${e.think} did yu meane **${findClosestCmdTo(cmd,
                    bot)}**?`;
            else if (typeof ret === 'string') out = ret;
            else return message.reply({ embeds: [ret] });
        }

        return message.reply(Util.cleanContent(out, message.channel));
    }
} as Command;
