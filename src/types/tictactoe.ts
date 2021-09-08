import { ButtonInteraction, Message, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { Command } from "./command";
import { Handler } from "./handler";
import { PieceGamePlayer } from  "./game";
import { connectAnyCommandExecute, ConnectAnyGame, ConnectAnyGrid, ConnectAnyHandleMessage, ConnectAnyPiece, ConnectAnyTurns, getValidPieces } from "./connectAny";

const { e } = require('../vars.json');

const TicTacToeStartCommand = {
    name: 'tictactoe',
    aliases: ['ttt'],
    help: {
        category: 'games',
        brief: 'chaleng anodar pleyer to pley tic tac toe wit yuo !',
        usage: 'tictactoe <opponent> <piece (emoji / custom emote)>'
    },
    async execute(message, args, handler) {
        connectAnyCommandExecute(message, args, handler, TicTacToeGame);
    }
} as Command;

class TicTacToeGame implements ConnectAnyGame {
    public channel : TextChannel | undefined;
    public challenger : PieceGamePlayer;
    public opponent : PieceGamePlayer;
    public grid : TicTacToeGrid;
    public confirmed : boolean;
    public turns : ConnectAnyTurns;
    public message?: Message;

    constructor(channel : TextChannel, challenger : PieceGamePlayer, opponent : PieceGamePlayer) {
        this.channel = channel;
        this.challenger = challenger;
        this.opponent = opponent;
        this.grid = new TicTacToeGrid();
        this.confirmed = false;
        this.turns = new ConnectAnyTurns(challenger, opponent);
    }

    public destroySelf(handler : Handler): void {
        handler.games.filter(v => v.channel?.id !== this.channel?.id);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.handleMessage = async ()=>{};
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.handleButton = async ()=>{};
        this.channel = undefined;
    }

    public async handleMessage(msg : Message, handler : Handler) : Promise<void> {
        ConnectAnyHandleMessage(msg, handler, this, async (msg, game) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            game.opponent.piece = getValidPieces(msg.content.trim())![0];
            game.confirmed = true;
            return await msg.reply({
                components: game.grid.toComponentArr(),
                content: `it's ${game.challenger.user.toString()}'s turne !!`
            });
        });
    }

    public async handleButton(interaction : ButtonInteraction, handler : Handler) : Promise<void> {
        if (interaction.user.id === this.turns.getCurrentTurnUser().id) {
            const piece = this.grid.placePiece([parseInt(interaction.customId.split('_')[1]) + 1, this.grid.height - 1 - parseInt(interaction.customId.split('_')[2])], this.turns.currentTurn);
            if (piece) {
                if (this.grid.checkWin(piece.position, piece.placedBy)) {
                    await interaction.update({
                        components: this.grid.toComponentArr(this.challenger, this.opponent),
                        content: `${this.turns.getCurrentTurnUser().toString()} wone !!! ${e.shock_handless.e}${e.party.e} GG !!!`
                    });
                    this.destroySelf(handler);
                    return;
                }
                if (this.grid.isGridFull()) {
                    await interaction.update({
                        components: this.grid.toComponentArr(this.challenger, this.opponent),
                        content: `it's a drawe !! GG !!! ${e.shock_handless.e}`
                    });
                    this.destroySelf(handler);
                    return;
                }
                this.turns.switchTurn();
                await interaction.update({
                    components: this.grid.toComponentArr(this.challenger, this.opponent),
                    content: `it's ${this.turns.getCurrentTurnUser().toString()}'s turne !!`
                });
            }
        }
    }
}

class TicTacToeGrid implements ConnectAnyGrid {
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
            try {
                arr[this.height - piece.position[1] - 1][piece.position[0] - 1] = piece.placedBy;
            // eslint-disable-next-line no-empty
            } catch (e) {}
        }
        return arr;
    }

    public toComponentArr(challenger : PieceGamePlayer, opponent : PieceGamePlayer) : MessageActionRow[] {
        const charArr = this.toCharArr();
        const btnArr = charArr.map((v, i) => v.map((y, j) => {
            const emj = this.charToEmoji(challenger, opponent, y);
            return new MessageButton()
            .setCustomId(`tictactoe_${j}_${i}`)
            .setEmoji(emj)
            .setStyle(emj !== e.blank.e ? (emj === e.greneblogie.e ? 'SUCCESS' : 'SECONDARY') : 'PRIMARY');
        })).map(v => new MessageActionRow()
            .addComponents(v)
        );
        return btnArr;
    }

    public charToEmoji(challenger : PieceGamePlayer, opponent : PieceGamePlayer, g : string) : string {
        return g === '*' ? e.blank.e : (
            g === 'C' ? challenger.piece : (
                g === 'O' ? opponent.piece : (
                    g === 'W' ? e.greneblogie.e : ''
                )
            )
        );
    }

    public placePiece(position : number[], placedBy : string) : TicTacToePiece | undefined {
        if (!this.pieces.some(v => v.position[0] === position[0] && v.position[1] === position[1])) {
            const piece = new TicTacToePiece(position, this, placedBy);
            this.pieces.push(piece);
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

class TicTacToePiece implements ConnectAnyPiece {
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

export {TicTacToeStartCommand, TicTacToeGame, TicTacToeGrid, TicTacToePiece};