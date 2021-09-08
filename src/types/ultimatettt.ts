import { Message, TextChannel } from "discord.js";
import { customEmoteRegex } from "../utils/customEmoteRegex";
import { emojiRegex } from "../utils/emojiRegex";
import { mentionRegex } from "../utils/mentionRegex";
import { Command } from "./command";
import { Game } from "./game";
import { Handler } from "./handler";
import { PieceGamePlayer } from "./game"; 
import { validatePiece, getValidPieces, ConnectAnyTurns } from "./connectAny";
import { TicTacToeGrid, TicTacToePiece } from "./tictactoe";
const { e } = require('../vars.json');

const UltimateTicTacToeStartCommand = {
    name: 'ultimatetictactoe',
    aliases: ['uttt', 'ultimatettt', 'utictactoe', 'ñandufrances'],
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
    public challenger : PieceGamePlayer;
    public opponent : PieceGamePlayer;
    public grid : UltimateTicTacToeGrid;
    public confirmed : boolean;
    public turns : ConnectAnyTurns;
    public message?: Message;

    static pieceRegex = new RegExp(new RegExp(customEmoteRegex).source + '|' + new RegExp(emojiRegex).source);

    constructor(channel : TextChannel, challenger : PieceGamePlayer, opponent : PieceGamePlayer) {
        this.channel = channel;
        this.challenger = challenger;
        this.opponent = opponent;
        this.grid = new UltimateTicTacToeGrid();
        this.confirmed = false;
        this.turns = new ConnectAnyTurns(challenger, opponent);
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
                    this.message = await msg.reply(`it's ${this.challenger.user.toString()}'s turne !! (curent grid: none) \n${this.grid.render(this.challenger, this.opponent)}`);
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
                    const a = this.grid.currentGrid;
                    if (this.grid.currentGrid > 0) {
                        const piece = this.grid.placePiece(num, this.grid.currentGrid, this.turns.currentTurn);
                        if (!piece) {
                            msg.reply(`dat spaec is fulle !! ${e.sad.e}`);
                            return;
                        }
                        if (this.grid.getCurrentGrid().checkWin(piece.position, piece.placedBy)) {
                            this.grid.getCurrentGrid().win(this.turns.currentTurn as gridWonByType);
                        }
                    }
                    if (this.grid.getGrid(num).gridWonBy !== '' || this.grid.getGrid(num).isGridFull()) {
                        this.grid.currentGrid = -1;
                    } else {
                        this.grid.currentGrid = num;
                    }
                    await msg.delete();
                    const g = ExtTTTGrid.fromCharArr(this.grid.grids.map(r => r.map(v => v.gridWonBy)));
                    if (g.pieces.length) {
                        if (g.checkWin(g.pieces[0].position, g.pieces[0].placedBy)) {
                            await this.message?.edit(`${this.turns.getCurrentTurnUser().toString()} wone !!! ${e.shock_handless.e}${e.party.e} GG !!! \n${this.grid.render(this.challenger, this.opponent)}`);
                            this.destroySelf(handler);
                            return;
                        }
                        if (g.isGridFull()) {
                            await this.message?.edit(`it's a drawe !! GG !!! ${e.shock_handless.e} \n${this.grid.render(this.challenger, this.opponent)}`);
                            this.destroySelf(handler);
                            return;
                        }
                    }
                    if (this.grid.grids.flat(1).every(v => v.gridWonBy !== '' || v.isGridFull())) {
                        await this.message?.edit(`it's a drawe !! GG !!! ${e.shock_handless.e} \n${this.grid.render(this.challenger, this.opponent)}`);
                        this.destroySelf(handler);
                        return;
                    }
                    if (a !== -1) this.turns.switchTurn();
                    await this.message?.edit(`it's ${this.turns.getCurrentTurnUser().toString()}'s turne !! (curent grid: ${this.grid.currentGrid > 0 ? this.grid.currentGrid : 'none'}, last moov: ${num}) \n${this.grid.render(this.challenger, this.opponent)}`);
                }
            } else if (!msg.author.bot && msg.content.trim() === "cancel") {
                msg.reply(`wat a looser !! imagin bakking oute !! ${e.funny.e}${e.stare.e} (succesfuli canceled de matche ${e.sad.e})`);
                this.destroySelf(handler);
            }
        }
    }
}

type gridWonByType = 'C' | 'O' | ''

const utttPattern = (byWhom : gridWonByType) : string[][] => {
    switch(byWhom) {
        case 'C':
            return [
                ['W', '*', 'W'],
                ['*', 'W', '*'],
                ['W', '*', 'W']
            ];
        case 'O':
            return [
                ['W', 'W', 'W'],
                ['W', '*', 'W'],
                ['W', 'W', 'W']
            ];
        default:
            return [];
    }
};

class ExtTTTGrid extends TicTacToeGrid {
    public gridWonBy : gridWonByType;

    constructor(pieces : TicTacToePiece[] = []) {
        super(pieces);
        this.gridWonBy = '';
    }

    static fromCharArr(charArr : string[][]) : ExtTTTGrid {
        const g = new ExtTTTGrid();
        if (charArr.length)
            charArr.forEach((r, i) => r.forEach((v, j) => { g.pieces.push(new TicTacToePiece([j + 1, 2 - i], g, v)); }));
        g.pieces = g.pieces.filter(v => v.placedBy !== '');
        return g;
    }

    public toCharArr() : string[][] {
        if (this.gridWonBy === '') return super.toCharArr();
        else return utttPattern(this.gridWonBy);
    }

    public win(byWhom : gridWonByType) : void {
        this.gridWonBy = byWhom;
    }
}

class UltimateTicTacToeGrid {
    public grids : ExtTTTGrid[][];
    public currentGrid : number;

    constructor() {
        this.grids = [[new ExtTTTGrid(), new ExtTTTGrid(), new ExtTTTGrid()], [new ExtTTTGrid(), new ExtTTTGrid(), new ExtTTTGrid()], [new ExtTTTGrid(), new ExtTTTGrid(), new ExtTTTGrid()]];
        this.currentGrid = -1;
    }

    public numToPos(num : number) : number[] {
        return [(num - 1) % 3 + 1, 2 - Math.floor((num - 1) / 3)];
    }

    public getCurrentGrid() : ExtTTTGrid {
        return this.getGrid(this.currentGrid);
    }

    public getGrid(num : number) : ExtTTTGrid {
        const gridPos = this.numToPos(num);
        const pgPos = [2 - gridPos[1], gridPos[0] - 1];
        return this.grids[pgPos[0]][pgPos[1]];
    }

    public placePiece(pos : number, gridNum : number, placedBy : string) : TicTacToePiece | undefined {
        const grid = this.getGrid(gridNum);
        if (!grid) return undefined;
        const piece = grid.placePiece(this.numToPos(pos), placedBy);
        if (!piece) return undefined;
        else return piece;
    }

    public render(challenger : PieceGamePlayer, opponent: PieceGamePlayer) : string {
        const rawCharArrs = this.grids.map(v => v.map(i => i.toCharArr()));
        const charArrs = rawCharArrs.map(v => v.map(r => r.map(y => y.join(' '))));
        const pCharArrs : string[] = [];
        charArrs.forEach(v => {
            for (let i = 0 ; i < v.length / 3 ; i += 3) {
                pCharArrs.push(v[i][0] + ' ⚫ ' + v[i + 1][0] + ' ⚫ ' + v[i + 2][0]);
                pCharArrs.push(v[i][1] + ' ⚫ ' + v[i + 1][1] + ' ⚫ ' + v[i + 2][1]);
                pCharArrs.push(v[i][2] + ' ⚫ ' + v[i + 1][2] + ' ⚫ ' + v[i + 2][2]);
            }
        });
        const outArr : string[] = [];
        for (let i = 0 ; i < pCharArrs.length ; i += 3) {
            outArr.push(pCharArrs[i] + '\n' + pCharArrs[i + 1] + '\n' + pCharArrs[i + 2]);
        }
        return outArr.join('\n⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫\n').replaceAll('*', '⚪').replaceAll('C', challenger.piece).replaceAll('O', opponent.piece).replaceAll('W', '🟢');
    }
}

export { UltimateTicTacToeStartCommand, UltimateTicTacToeGrid };