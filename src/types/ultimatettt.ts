import { Message, TextChannel } from "discord.js";
import { customEmoteRegex } from "../utils/customEmoteRegex";
import { emojiRegex } from "../utils/emojiRegex";
import { mentionRegex } from "../utils/mentionRegex";
import { validateCustomEmote } from "../utils/validateCustomEmote";
import { Command } from "./command";
import { Game } from "./game";
import { Handler } from "./handler";
import { TicTacToePlayer, TicTacToeGrid, TicTacToePiece, TicTacToeTurns } from "./tictactoe";
const { e } = require('../vars.json');

const validatePiece = (piece : string, handler: Handler) : boolean => !!(piece.match(UltimateTicTacToeGame.pieceRegex) && (piece.match(customEmoteRegex) ? validateCustomEmote(piece, handler) : piece.match(emojiRegex)) && piece.normalize().split('') !== '⚪'.split('') && !([':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':asterisk:',':hash:',':1234:',e.greneblogie.e].includes(piece)));
const getValidPieces = (piece : string) : string[] | undefined => piece.match(UltimateTicTacToeGame.pieceRegex)?.map(v => v?.toString());

const chunkArray = <T>(arr : T[], chunkSize : number) : T[][] => {
    const finalArr : T[][] = [];
    for (let i = 0 ; i < arr.length; i += chunkSize) {
        finalArr.push(arr.slice(i, i + chunkSize));
    }
    return finalArr;
};

const UltimateTicTacToeStartCommand = {
    name: 'ultimatetictactoe',
    aliases: ['uttt', 'ultimatettt', 'utictactoe'],
    help: {
        category: 'games',
        brief: 'chaleng anodar pleyer to pley da ultimat tic tac toe wit yuo !',
        usage: 'ultimatetictactoe <opponent> <piece (emoji / custom emote)>'
    },
    async execute(message, args, handler) {
        if (handler.games.some(v => v.channel?.id === message.channelId)) {
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

        if (!validatePiece(challengerPiece, handler)) {
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

        handler.games.push(new UltimateTicTacToeGame(message.channel as TextChannel, {
            user: challenger,
            piece: challengerPiece
        }, {
            user: opponent,
            piece: ''
        }));
        
        message.reply(`${opponent.toString()}, yu hav been chalenged ! ${e.shock_handless.e} pleas choos a custom emot or emnoji ! ${e.please.e} (or tyep "cancel" to cancel de matche !) i wil be weitin ${e.stare.e}`);
        
        return;
    }
} as Command;

class UltimateTicTacToeGame implements Game {
    public channel : TextChannel | undefined;
    public challenger : TicTacToePlayer;
    public opponent : TicTacToePlayer;
    public grid : UltimateTicTacToeGrid;
    public confirmed : boolean;
    public turns : TicTacToeTurns;
    public message?: Message;

    static pieceRegex = new RegExp(new RegExp(customEmoteRegex).source + '|' + new RegExp(emojiRegex).source);

    constructor(channel : TextChannel, challenger : TicTacToePlayer, opponent : TicTacToePlayer) {
        this.channel = channel;
        this.challenger = challenger;
        this.opponent = opponent;
        this.grid = new UltimateTicTacToeGrid();
        this.confirmed = false;
        this.turns = new TicTacToeTurns(challenger, opponent);
    }
    
    public destroySelf(handler : Handler): void {
        handler.games.filter(v => v.channel?.id !== this.channel?.id);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.handleMessage = async ()=>{};
        this.channel = undefined;
    }

    async handleMessage(msg : Message, handler : Handler) : Promise<void> {
        if (!this.confirmed) {
            if (msg.author.id === this.opponent.user.id) {
                if (validatePiece(msg.content.trim(), handler)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    if (getValidPieces(msg.content.trim())![0] === this.challenger.piece) {
                        msg.reply(`${e.think.e} yu shuldnt hav de saem piec as de odar preson !`);
                        return;
                    }
                    msg.reply(`${e.happy.e} started matche betweene ${this.challenger.user.toString()} ande ${this.opponent.user.toString()}!`);
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.opponent.piece = getValidPieces(msg.content.trim())![0];
                    this.confirmed = true;
                    this.message = await msg.reply(`it's ${this.challenger.user.toString()}'s turne !! \n${this.grid.render(this.challenger, this.opponent)}`);
                }
            }
            if (msg.content === "cancel") {
                msg.reply(`sucesfulie canceled matche betweene ${this.challenger.user.toString()} ande ${this.opponent.user.toString()}! ${e.sad2.e} i reali waned to see yu guyse pley`);
                this.destroySelf(handler);
            }
        } else {
            if (!msg.author.bot && this.turns.validateMessage(msg) && parseInt(msg.content)) {
                const num = parseInt(msg.content);
                if (num > 0 && num < 10) {
                    const piece = this.grid.placePiece(num, 3, this.turns.currentTurn);
                    if (!piece) {
                        msg.reply(`dat spaec is fulle !! ${e.sad.e}`);
                        return;
                    }
                    await msg.delete();
                    /*if (this.grid.checkWin(piece.position, piece.placedBy)) {
                        await this.message?.edit(`${this.turns.getCurrentTurnUser().toString()} wone !!! ${e.shock_handless.e}${e.party.e} GG !!! \n${this.grid.render(this.challenger, this.opponent)}`);
                        this.destroySelf(handler);
                        return;
                    }
                    if (this.grid.isGridFull()) {
                        await this.message?.edit(`it's a drawe !! GG !!! ${e.shock_handless.e} \n${this.grid.render(this.challenger, this.opponent)}`);
                        this.destroySelf(handler);
                        return;
                    }*/
                    this.turns.switchTurn();
                    await this.message?.edit(`it's ${this.turns.getCurrentTurnUser().toString()}'s turne !! (last moov: ${num}) \n${this.grid.render(this.challenger, this.opponent)}`);
                }
            } else if (!msg.author.bot && msg.content.trim() === "cancel") {
                msg.reply(`wat a looser !! imagin bakking oute !! ${e.funny.e}${e.stare.e} (succesfuli canceled de matche ${e.sad.e})`);
                this.destroySelf(handler);
            }
        }
    }
}

class UltimateTicTacToeGrid {
    public grids : TicTacToeGrid[][];
    public currentGrid : number;

    constructor() {
        this.grids = [[new TicTacToeGrid(), new TicTacToeGrid(), new TicTacToeGrid()], [new TicTacToeGrid(), new TicTacToeGrid(), new TicTacToeGrid()], [new TicTacToeGrid(), new TicTacToeGrid(), new TicTacToeGrid()]];
        this.currentGrid = -1;
    }

    public numToPos(num : number) : number[] {
        return [(num - 1) % 3 + 1, 2 - Math.floor((num - 1) / 3)];
    }

    public placePiece(pos : number, gridNum : number, placedBy : string) : TicTacToePiece | undefined {
        const gridPos = this.numToPos(gridNum);
        const grid = this.grids[gridPos[0] - 1][gridPos[1] - 2];
        if (!grid) return undefined;
        const piece = grid.placePiece(this.numToPos(pos), placedBy);
        if (!piece) return undefined;
        else return piece;
    }

    public render(challenger : TicTacToePlayer, opponent: TicTacToePlayer) : string {
        const rawCharArrs = this.grids.map(v => v.map(i => i.toCharArr()));
        const chars = rawCharArrs.flat(4);
        const renderedChars = chars.map(v => {
            return v.replaceAll('*', '⚪').replaceAll('C', challenger.piece).replaceAll('O', opponent.piece).replaceAll('W', '🟢');
        });
        const charsGroup1 = chunkArray(renderedChars, 27);
        const charsPass1 = charsGroup1.map(v => v.join(' ')).join('\n');
        const charsGroup2 = chunkArray(charsPass1.split(' '), 9);
        const regroup2 = (arr : string[][]) : string[][] => {
            const g1 = arr.map(v => v.slice(0, 3));
            const g2 = arr.map(v => v.slice(3, 6));
            const g3 = arr.map(v => v.slice(6, 9));
            const g = [g1.map(v => v.join(' ')), g2.map(v => v.join(' ')), g3.map(v => v.join(' '))];
            return g;
        };
        console.log(regroup2(charsGroup2).map(v => v.join(' ')));
        const charsPass2 = regroup2(charsGroup2).map(v => v.join(' ')).join('\n');
        return charsPass2;
    }
}

export { UltimateTicTacToeStartCommand, UltimateTicTacToeGrid };