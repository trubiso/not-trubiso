import { Message, TextChannel, User } from "discord.js";
import { customEmoteRegex } from "../utils/customEmoteRegex";
import { emojiRegex } from "../utils/emojiRegex";
import { mentionRegex } from "../utils/mentionRegex";
import { Command } from "./command";
import { Handler } from "./handler";

const { e } = require('../vars.json');

const validatePiece = (piece : string) : boolean => !!(piece.match(ConnectGame.pieceRegex) && piece.normalize().split('') !== '⚪'.split(''));
const getValidPieces = (piece : string) : string[] | undefined => piece.match(ConnectGame.pieceRegex)?.map(v => v.toString());

const ConnectStartCommand = {
    name: 'connect4',
    help: {
        category: 'fun',
        brief: 'chaleng anodar pleyer to pley conect 4 wit yuo !',
        usage: 'connect4 <opponent> <piece (emoji / custom emote)>'
    },
    async execute(message, args, handler) {
        if (handler.connectGames.some(v => v.channel?.id === message.channelId)) {
            throw `der alredi is a gaem in dis chanel !!`;
        }

        if (!args.length) {
            throw `plees choos a person to chaleng !`;
        }
        if (args.length === 1) {
            throw `pleas choos a piec for yu to pley withe !`;
        }
        if (args.length > 2) {
            throw `rong amount of parameterse !`;
        }

        const mention = args[0].match(mentionRegex);

        if (!mention) {
            throw `mention a person propreli !!`;
        }
        if (mention[1]) {
            throw `yu shuld only be mentioninge wan preson`;
        }

        let challengerPiece = args[1];

        if (!validatePiece(challengerPiece)) {
            throw `pleas input a proper emojie for yur second prameter !`;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        challengerPiece = getValidPieces(challengerPiece)![0];

        const challenger = message.author;
        const opponent = await handler.client.users.fetch(mention[0].replace(/[<@!>]/g, ''));

        if (challenger.toString() === opponent.toString()) {
            throw `yu cant chaleng yurslef !!`;
        }
        if (opponent.bot) {
            throw `yu cant chaleng a bot !!`;
        }

        handler.connectGames.push(new ConnectGame(message.channel as TextChannel, {
            user: challenger,
            piece: challengerPiece
        }, {
            user: opponent,
            piece: ''
        }, 7));
        
        message.reply(`${opponent.toString()}, yu hav been chalenged ! ${e.shock_handless.e} pleas choos a custom emot or emnoji ! ${e.please.e} (or tyep "cancel" to cancel de matche !) i wil be weitin ${e.stare.e}`);
        
        return;
    }
} as Command;

type ConnectPlayer = {
    user : User,
    piece : string
};

class ConnectGame {
    public channel : TextChannel | undefined;
    public challenger : ConnectPlayer;
    public opponent : ConnectPlayer;
    public grid : ConnectGrid;
    public confirmed : boolean;

    static pieceRegex = new RegExp(new RegExp(customEmoteRegex).source + '|' + new RegExp(emojiRegex).source);

    constructor(channel : TextChannel, challenger : ConnectPlayer, opponent : ConnectPlayer, gridSize : number) {
        this.channel = channel;
        this.challenger = challenger;
        this.opponent = opponent;
        this.grid = new ConnectGrid(gridSize, gridSize);
        this.confirmed = false;
    }

    public handleMessage(msg : Message, handler : Handler) : void {
        if (!this.confirmed) {
            if (msg.author.id === this.opponent.user.id) {
                if (validatePiece(msg.content.trim())) {
                    msg.reply(`${e.happy.e} started matche betweene ${this.challenger.user.toString()} ande ${this.opponent.user.toString()}!`);
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.opponent.piece = getValidPieces(msg.content.trim())![0];
                    this.confirmed = true;
                    console.log(this);
                }
                if (msg.content === "cancel") {
                    msg.reply(`sucesfulie canceled matche betweene ${this.challenger.user.toString()} ande ${this.opponent.user.toString()}! ${e.sad2.e} i reali waned to see yu guyse pley`);
                    handler.connectGames.filter(v => v.channel?.id !== this.channel?.id);
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    this.handleMessage = ()=>{};
                    this.channel = undefined;
                }
            }
        }
    }
}

class ConnectGrid {
    public size : number[];

    constructor(width : number, height : number) {
        this.size = [width, height];
    }
}

export {ConnectStartCommand, ConnectPlayer, ConnectGame, ConnectGrid};