import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageButtonOptions, MessageOptions, MessageSelectMenu, SelectMenuInteraction, TextChannel } from "discord.js";
import { Aki } from 'aki-api';
import { Game, GamePlayer } from "./game";
import { Handler } from "./handler";
import { guess } from "aki-api/typings/src/functions";

const { e } = require('../vars.json');

class AkinatorGame implements Game {
    public channel : TextChannel | undefined;
    public challenger : GamePlayer;
    public game : Aki;

    private hasWon : boolean;
    private finalGuess?: guess;

    private checkWin() {
        return (this.game.progress >= 70 || this.game.currentStep >= 78);
    }

    private getWinContent() {
        const g = (this.game.answers[0] as guess);
        this.finalGuess = g;
        return { embeds: [{
            title: `is yur charecter ${g.name}??`,
            image: {
                url: g.absolute_picture_path
            },
            description: "tel me !!"
        }], components: [new MessageActionRow().addComponents([
            new MessageButton({
                label: 'yese !!',
                emoji: e.happy.id,
                customId: 'yes',
                style: 'SUCCESS'
            } as MessageButtonOptions), new MessageButton({
                label: 'noe.. ',
                emoji: e.sad.id,
                customId: 'no',
                style: 'DANGER'
            } as MessageButtonOptions)
        ])]} as MessageOptions;
    }

    private getFinalContent() {
        const g = this.finalGuess;
        if (!g) throw "didnt finish da game yu stupide bot";
        return { embeds: [{
            title: `YEYAHEHE !!! I GUESEDED CORECTLI !! ${e.happy}${e.happy}${e.happy}`,
            description: `THENKES FOR PLEYING WIT ME !! HAV AN AMEZING DEY !!!! ${e.happy} (de charecter wase ${g.name})`,
            image: {
                url: g.absolute_picture_path
            }
        }], components: []} as MessageOptions;
    }

    private getLoseContent() {
        return { embeds: [{
            title: `i loste... ${e.sad3.e}`,
            description: `hav a gud dey but kno i wont ${e.sad}`
        }], components: []} as MessageOptions;
    }

    private getMsgContent() {
        return {
            embeds: [{
                title: `qeustion nº${this.game.currentStep + 1} !!`,
                description: this.game.question
            }],
            components: [new MessageActionRow().addComponents(new MessageSelectMenu().addOptions([
                { label: 'yese !!', emoji: e.happy.id, value: '0' },
                { label: 'noe...', emoji: e.sad.id, value: '1' },
                { label: 'don\'t kno', emoji: e.think.id, value: '2' },
                { label: 'probablie', emoji: e.glad.id, value: '3' },
                { label: 'probabli note', emoji: e.sad2.id, value: '4' },
                { label: 'cancel de gaem', emoji: e.angry_pink.id, value: 'cancel' }
            ]).setCustomId('akinator_select').setMinValues(1).setMaxValues(1).setPlaceholder('wat u thinke?'))]
        } as MessageOptions;
    }

    constructor (msg : Message, childMode = false) {
        this.hasWon = false;
        this.challenger = { user: msg.author };
        this.game = new Aki({ region: 'en', childMode: childMode });
        this.game.start().then(()=>{
            msg.reply(this.getMsgContent());
        });
        this.channel = msg.channel as TextChannel;
    }

    destroySelf(handler : Handler) : void {
        handler.games.filter(v => v.channel?.id !== this.channel?.id);
        this.channel = undefined;
    }

    async handleSelectMenu(i: SelectMenuInteraction, handler : Handler) : Promise<void> {
        const val = i.values[0];
        if (val === 'cancel') {
            await i.update({ embeds: [{
                title: `yu canseld de gaem ${e.sad}`,
                description: `hop yu had a niec tiem ${e.glad}`
            }], components: []});
            this.destroySelf(handler);
        } else {
            await this.game.step(parseInt(val) as 0|1|2|3|4);
            this.hasWon = this.checkWin();
            if (this.hasWon) {
                await this.game.win();
                await i.update(this.getWinContent());
            } else {
                await i.update(this.getMsgContent());
            }
        }
    }
    async handleButton(i : ButtonInteraction, handler : Handler) : Promise<void> {
        switch(i.customId) {
        case "yes":
            await i.update(this.getFinalContent());
            break;
        case "no":
            await i.update(this.getLoseContent());
            break;
        }
        this.destroySelf(handler);
    }
}

export { AkinatorGame };