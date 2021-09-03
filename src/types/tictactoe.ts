import { Message, TextChannel, User } from "discord.js";
import { customEmoteRegex } from "../utils/customEmoteRegex";
import { emojiRegex } from "../utils/emojiRegex";
import { mentionRegex } from "../utils/mentionRegex";
import { validateCustomEmote } from "../utils/validateCustomEmote";
import { Command } from "./command";
import { Handler } from "./handler";
import { GameGrid, GameTurns, GridGame, GridGamePiece } from  "./game";

const { e } = require('../vars.json');

const validatePiece = (piece : string, handler: Handler) : boolean => !!(piece.match(TicTacToeGame.pieceRegex) && (piece.match(customEmoteRegex) ? validateCustomEmote(piece, handler) : piece.match(emojiRegex)) && piece.normalize().split('') !== '⚪'.split('') && !([':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':asterisk:',':hash:',':1234:',e.greneblogie.e].includes(piece)));
const getValidPieces = (piece : string) : string[] | undefined => piece.match(TicTacToeGame.pieceRegex)?.map(v => v?.toString());

const TicTacToeStartCommand = {
    name: 'tictactoe',
    aliases: ['ttt'],
    help: {
        category: 'games',
        brief: 'chaleng anodar pleyer to pley tic tac toe wit yuo !',
        usage: 'tictactoe <opponent> <piece (emoji / custom emote)>'
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

        handler.games.push(new TicTacToeGame(message.channel as TextChannel, {
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

type TicTacToePlayer = {
    user : User
    piece : string
};

class TicTacToeTurns implements GameTurns {
    public currentTurn : string;
    public challenger : TicTacToePlayer;
    public opponent : TicTacToePlayer;

    constructor(challenger : TicTacToePlayer, opponent : TicTacToePlayer) {
        this.currentTurn = "C";
        this.challenger = challenger;
        this.opponent = opponent;
    }

    public getCurrentTurnUser() : User {
        return this.currentTurn === "C" ? this.challenger.user : this.opponent.user;
    }

    public switchTurn() : string {
        this.currentTurn = this.currentTurn === "C" ? "O" : "C";
        return this.currentTurn;
    }

    public validateMessage(msg : Message) : boolean {
        return msg.author.id === (this.getCurrentTurnUser().id);
    }
}

class TicTacToeGame implements GridGame {
    public channel : TextChannel | undefined;
    public challenger : TicTacToePlayer;
    public opponent : TicTacToePlayer;
    public grid : TicTacToeGrid;
    public confirmed : boolean;
    public turns : TicTacToeTurns;

    static pieceRegex = new RegExp(new RegExp(customEmoteRegex).source + '|' + new RegExp(emojiRegex).source);

    constructor(channel : TextChannel, challenger : TicTacToePlayer, opponent : TicTacToePlayer) {
        this.channel = channel;
        this.challenger = challenger;
        this.opponent = opponent;
        this.grid = new TicTacToeGrid();
        this.confirmed = false;
        this.turns = new TicTacToeTurns(challenger, opponent);
    }

    public destroySelf(handler : Handler): void {
        handler.games.filter(v => v.channel?.id !== this.channel?.id);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.handleMessage = ()=>{};
        this.channel = undefined;
    }

    public handleMessage(msg : Message, handler : Handler) : void {
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
                    msg.reply(`it's ${this.challenger.user.toString()}'s turne !! \n${this.grid.render(this.challenger, this.opponent)}`);
                }
                if (msg.content === "cancel") {
                    msg.reply(`sucesfulie canceled matche betweene ${this.challenger.user.toString()} ande ${this.opponent.user.toString()}! ${e.sad2.e} i reali waned to see yu guyse pley`);
                    this.destroySelf(handler);
                }
            }
        } else {
            if (!msg.author.bot && this.turns.validateMessage(msg) && parseInt(msg.content)) {
                const num = parseInt(msg.content);
                if (num > 0 && num < 10) {
                    const piece = this.grid.placePiece([(num - 1) % 3 + 1, this.grid.height - 1 - Math.floor((num - 1) / 3)], this.turns.currentTurn);
                    if (!piece) {
                        msg.reply(`dat spaec is fulle !! ${e.sad.e}`);
                        return;
                    }
                    if (this.grid.isGridFull()) {
                        msg.reply(`it's a drawe !! GG !!! ${e.shock_handless.e} \n${this.grid.render(this.challenger, this.opponent)}`);
                        this.destroySelf(handler);
                        return;
                    }
                    if (this.grid.checkWin(piece.position, piece.placedBy)) {
                        msg.reply(`${this.turns.getCurrentTurnUser().toString()} wone !!! ${e.shock_handless.e}${e.party.e} GG !!! \n${this.grid.render(this.challenger, this.opponent)}`);
                        this.destroySelf(handler);
                        return;
                    }
                    this.turns.switchTurn();
                    msg.reply(`it's ${this.turns.getCurrentTurnUser().toString()}'s turne !! \n${this.grid.render(this.challenger, this.opponent)}`);
                }
            } else if (!msg.author.bot && msg.content.trim() === "cancel") {
                msg.reply(`wat a looser !! imagin bakking oute !! ${e.funny.e}${e.stare.e} (succesfuli canceled de matche ${e.sad.e})`);
                this.destroySelf(handler);
            }
        }
    }
}

class TicTacToeGrid implements GameGrid {
    public width : number;
    public height : number;
    public pieces : TicTacToePiece[];

    constructor(pieces : TicTacToePiece[] = []) {
        [this.width, this.height] = [3, 3];
        this.pieces = pieces;
    }

    public toCharArr() : string[][] {
        const arr = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => '*'));
        for (const piece of this.pieces) {
            arr[this.height - piece.position[1] - 1][piece.position[0] - 1] = piece.placedBy;
        }
        return arr;
    }

    public render(challenger : TicTacToePlayer, opponent : TicTacToePlayer) : string {
        let grid = this.toCharArr().map(v => v.join(' ')).join('\n');
        grid = grid.replaceAll('*', '⚪');
        grid = grid.replaceAll('C', challenger.piece);
        grid = grid.replaceAll('O', opponent.piece);
        grid = grid.replaceAll('W', e.greneblogie.e);
        return grid;
    }

    public placePiece(position : number[], placedBy : string) : TicTacToePiece | undefined {
        if (!this.pieces.some(v => v.position[0] === position[0] && v.position[1] === position[1])) {
            const piece = new TicTacToePiece(position, this, placedBy);
            this.pieces.push(piece);
            console.log(this.pieces.map(v => v.position));
            return piece;
        } else {
            return undefined;
        }
    }

    public isGridFull() : boolean {
        return !this.toCharArr().flat(2).some(v => v === '*');
    }

    public validateValue(x : number, y : number) : boolean {
        return (x > 0 && x < this.width + 1) && (y > -1 && y < this.height);
    }

    public checkWin(cpPos : number[], cpPlacedBy : string) : boolean {
        const directions = [ [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1] ];
        type dirObjType = {
            direction: number[],
            piecesFound: number,
            piecesFoundArr: TicTacToePiece[]
        }
        type axisType = {
            directions: number[][],
            piecesFound: number,
            piecesFoundArr: TicTacToePiece[]
        }
        const dirObjs = directions.map(v => {return {
            direction: v,
            piecesFound: 0,
            piecesFoundArr: []
        } as dirObjType;});
        let pos = [cpPos[0], cpPos[1]];
        for (const direction of directions) {
            // eslint-disable-next-line no-constant-condition
            while(true) {
                pos[0] += direction[0];
                pos[1] += direction[1];
                if (this.validateValue(pos[0], pos[1]) && this.pieces.find(v => v.position[0] === pos[0] && v.position[1] === pos[1])?.placedBy === cpPlacedBy) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const dirObj = dirObjs.find(v => v.direction === direction)!;
                    dirObj.piecesFound++;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    dirObj.piecesFoundArr.push(this.pieces.find(v => v.position[0] === pos[0] && v.position[1] === pos[1])!);
                } else {
                    pos = [cpPos[0], cpPos[1]];
                    break;
                }
            }
        }
        const axis = directions.slice(0, 4).map(v => {return {
            directions: [v, [(v[0] === 0 ? 0 : -v[0]), (v[1] === 0 ? 0 : -v[1])]],
            piecesFound: 0
        };});
        const processedAxis = axis.map(v => {
            const a = dirObjs.filter(a => v.directions.some(i => i[0] === a.direction[0] && i[1] === a.direction[1]));
            return {
                directions: v.directions,
                piecesFound: a[0].piecesFound + a[1].piecesFound,
                piecesFoundArr: [...a[0].piecesFoundArr, ...a[1].piecesFoundArr]
            } as axisType;
        });
        for (const paxis of processedAxis) {
            if (paxis.piecesFound >= 2) {
                this.pieces.forEach(v => [...paxis.piecesFoundArr.map(a => a.position), cpPos].includes(v.position) ? v.placedBy = "W" : 1);
                return true;
            }
        }
        return false;
    }
}

class TicTacToePiece implements GridGamePiece {
    public position : number[];
    public grid : TicTacToeGrid;
    public placedBy : string;

    constructor(position : number[], grid : TicTacToeGrid, placedBy : string) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (grid.pieces.every(v => v.position !== position)) {
            this.position = position;
        } else this.position = [-1, -1];
        this.grid = grid;
        this.placedBy = placedBy;
    }
}

export {TicTacToeStartCommand, TicTacToePlayer, TicTacToeTurns, TicTacToeGame, TicTacToeGrid, TicTacToePiece};