import Command from '@core/command';
import { e } from '@core/vars';
import { Util } from 'discord.js';
import Levenshtein from 'levenshtein';
const getClosest = require('get-closest'); // no es6 module :(

export = {
  name: 'help',
  aliases: ['cmds'],
  help: {
    brief: 'shows help for eny comand, categori or just evri comande',
    usage: '[command]',
    examples: ['', 'help', 'greetme'],
    extra:
      'luk at da usag for eech comand !!\n' +
      '[paramteter] meens dat der is a parametere "paramteter" wich is OPTIONALELE !!\n' +
      `butte... (${e.funny}) <paramteter> meens dat der is a parametere "paramteter" wich is REQUIREDELE !!\n` +
      `da rest shuld be obvius !! thoughe if yu don understand ask TRUMBINSO and he wil help yu decoed da usag of any comande ${e.glad}`
  },
  execute(command?) {
    const compareLevenshteinDistance = (compareTo: string, baseItem: string) =>
      new Levenshtein(compareTo, baseItem).distance;

    const findClosestCmdTo = (cmd: string) => {
      const cmds = [...this.bot.commands.map(v => v.name)];
      this.bot.commands
        .filter(v => typeof v.aliases != 'undefined')
        .forEach(v => cmds.push(...(v.aliases as string[])));
      cmds.push(...this.bot.categories.map(v => v.name));

      return cmds[getClosest.custom(cmd, cmds, compareLevenshteinDistance)];
    };

    const getHelp = (cmd: string) => {
      const out = '';
      const cmdExists = false;
      const prefix = this.bot.prefix;
      for (const commandName of this.bot.commands) {
        const command = this.bot.commands.get(commandName[0])!;
        if (command.name !== cmd && !command.aliases?.includes(cmd)) continue;

        const embed = {
          title: `help abuot ${prefix}${command.name}`,
          fields: [
            {
              name: 'brif descreption',
              value: command.help.brief
            },
            {
              name: 'useg',
              value: `\`${prefix}${command.name}${command.help.usage ? ` ${command.help.usage}` : ''}\``,
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

        if (command.help.examples)
          embed.fields.push({
            name: 'exampels',
            value: command.help.examples.map(v => `\`${prefix}${command.name}${v.length ? ' ' : ''}${v}\``).join('\n') // this seems more complex than it actually is
          });

        if (command.help.extra)
          embed.fields.push({
            name: 'moar informetion',
            value: command.help.extra
          });

        return embed;
      }

      for (const category of this.bot.categories)
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
    };

    let out = '';
    if (!command) {
      out = '**commandse: **\n\n';
      for (const category of this.bot.categories.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))) {
        out += `**${category.help.name}: **`;
        for (const command of category.commands) out += `${command.name}, `;

        out = `${out.slice(0, -2)}\n`;
      }
    } else {
      const cmd = command.toString().toLowerCase();
      const ret = getHelp(cmd);
      if (ret === false)
        out = `i culdn't find anythinge for **${cmd}**... ${e.think} did yu meane **${findClosestCmdTo(cmd)}**?`;
      else if (typeof ret === 'string') out = ret;
      else return this.reply({ embeds: [ret] });
    }

    return this.reply(Util.cleanContent(out, this.channel));
  }
} as Command;
