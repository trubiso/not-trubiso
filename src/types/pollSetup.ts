import { Message, MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel } from "discord.js";
import { containsEmoji } from "../utils/containsEmoji";
import { getEmojis } from "../utils/getEmojis";
import { Game, GamePlayer } from "./game";
import { Handler } from "./handler";
import { Poll } from "./poll";
import { PollOptionResolvable } from "./pollOptionResolvable";

const { e } = require('../vars.json');

export type rawOption = {
    emoji: string,
    description: string
};

export class PollSetup implements Game {
    public channel : TextChannel | undefined;
    public challenger : GamePlayer;
    private message?: Message;

    private pollTitle : string;
    private pollDescription : string;
    private pollOptions : rawOption[] = [];

    public static parseEmojiOption(option : string) : rawOption {
        const optionParts = option.split('->').map(v => v.trim());
        let emojiId : string;
        if (containsEmoji(optionParts[0])) {
            emojiId = getEmojis(optionParts[0])[0];
        } else {
            try {
                emojiId = optionParts[0].split(':')[2].slice(0, -1);
            } catch (error) {
                throw "invalid emojies !";
            }
        }
        const emojiDescription = optionParts[1];
        return {
            emoji: emojiId,
            description: emojiDescription
        };
    }

    public static rawOptionToResolvable(option : rawOption, message : Message) : PollOptionResolvable {
        return {emojiId: option.emoji, message: message};
    }

    private pollOptionsField(handler?: Handler) {
        return {
            name: 'optionese !',
            value: (this.pollOptions.length ? this.pollOptions.map(v => `${handler?.client.emojis.resolve(v.emoji)} ${v.description ? ` -> ${v.description}` : ``}`).join(', ') : "none yet !!") + (this.pollDescription !== "" ? "\n\nadd moar by usinge da `<emojei / custom emot> -> <emot descreption>` syntaxe, finish da poll by seying \"done\" and cancel it by seying \"cancel\"!" : "")
        };
    }

    private pollMessage(handler?: Handler) {
        return {
            title: 'poll setupeing',
            description: 'let\'s set up a polle !',
            fields: [{
                name: this.pollTitle,
                value: this.pollDescription !== "" ? this.pollDescription : "giv me a descripteion ! (send a mesag withe it)"
            }, this.pollOptionsField(handler)]
        } as MessageEmbed;
    }

    private get canceledMessage() {
        return {
            title: 'canceld de setup !',
            description: 'hop i was helpfule..'
        } as MessageEmbed;
    }

    constructor(msg : Message, title : string) {
        this.challenger = {
            user: msg.author
        };
        this.channel = msg.channel as TextChannel;
        this.pollTitle = title;
        this.pollDescription = "";
        (async ()=>{this.message = await msg.reply({embeds:[this.pollMessage()]});})();
    }

    destroySelf(handler : Handler) : void {
        handler.games.filter(v => v.channel?.id !== this.channel?.id);
        this.channel = undefined;
    }

    async handleMessage(msg : Message, handler : Handler) : Promise<void> {
        if (msg.content.trim().toLowerCase() === "cancel") {
            await msg.delete();
            if (this.message) this.message.edit({embeds:[this.canceledMessage]});
            this.destroySelf(handler);
            return;
        }
        if (this.pollDescription === "") {
            this.pollDescription = msg.content;
            await msg.delete();
            if (this.message) this.message.edit({embeds:[this.pollMessage(handler)]});
        } else {
            if (msg.content.trim().toLowerCase() !== "done") {
                try {
                    this.pollOptions.push(PollSetup.parseEmojiOption(msg.content.trim()));
                    await msg.delete();
                    if (this.message) this.message.edit({embeds:[this.pollMessage(handler)]});
                } catch(e) {e;}
            } else if (this.pollOptions.length) {
                const embed = {
                    title: `polle !! ${e.shock_handless.e}`,
                    fields: [
                        {
                            name: this.pollTitle,
                            value: this.pollDescription
                        },
                        {
                            name: "statse",
                            value: "no reactionese yet !"
                        }
                    ],
                    author: {name: `starteded by ${this.challenger.user.username} !!`}
                };
        
                const select = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('poll_select')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setPlaceholder('select an opteion !')
                            .addOptions(
                                this.pollOptions.map((v, i) => {return {
                                    label: 'optione ' + (i + 1),
                                    description: v.description,
                                    value: v.emoji,
                                    emoji: v.emoji
                                };})
                            )
                    );
        
                const pollMessage = await msg.channel.send({embeds: [embed], components: [select]});
                const pollObject = new Poll(this.pollOptions.map(v => PollSetup.rawOptionToResolvable(v, pollMessage)), pollMessage);
                handler.polls.push(pollObject);
                await msg.delete();
                await this.message?.delete();
                this.destroySelf(handler);
            }
        }
    }
}