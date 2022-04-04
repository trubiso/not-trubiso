import Command from '@core/command';
import { e } from '@core/vars';

export = {
  name: 'randomcolor',
  aliases: ['rc'],
  help: {
    category: 'random',
    brief: 'randome colorere'
  },
  execute() {
    const color = (Math.random() * 0xfffff * 1000000).toString(16).slice(1, 7);
    this.reply({
      embeds: [
        {
          title: `random colore !! ${e.shock_handless}`,
          description: `i chosese #${color} ${e.happy}`,
          color: `#${color}`
        }
      ]
    });
  }
} as Command;
