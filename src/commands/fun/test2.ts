import { MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js";
import { Command } from "../../types/command";

const { e } = require('../../vars.json');

export = {
	name: 'test2',
	help: {
        category: 'fun',
		brief: 'test comande (de sequel !)',
		usage: 'test2'
	},
    execute(message) {
        const row = new MessageActionRow()
			.addComponents(
                new MessageSelectMenu()
                    .setCustomId('test2_select')
                    .setPlaceholder(`you haven't selected anything`)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(
                        {
                            label: 'cool option',
                            description: 'click on it',
                            value: 'cool_option',
                            emoji: e.party.id
                        },
                        {
                            label: 'cooki',
                            description: 'handmaed and teisti',
                            value: 'cookie',
                            emoji: '🍪'
                        }
                    )
			);
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('test2_button')
                    .setLabel('whistel !')
                    .setStyle('SUCCESS')
                    .setEmoji(e.whistling.id)
            );
                    
        message.reply({content: 'clik on da buton to get somthin !', components: [row, row2]});
    },
    handleButton(interaction) {
        if (interaction.customId === 'test2_button') {
            interaction.update(interaction.message.content + ' ' + e.whistling.e);
        }
    },
    handleSelectMenu(interaction) {
        if (interaction.customId === 'test2_select') {
            if (interaction.values[0] === 'cool_option')
                interaction.update(interaction.message.content + ' ' + e.party.e);
            else if (interaction.values[0] === 'cookie')
                interaction.update(interaction.message.content + ' 🍪');
        }
    }
} as Command;