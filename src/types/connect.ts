import { ButtonInteraction, Message, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { Command } from "./command";
import { Handler } from "./handler";
import { GridGame, GridGamePiece, PieceGamePlayer } from  "./game";
import { ConnectAnyCheckWin, connectAnyCommandExecute, ConnectAnyGrid, ConnectAnyHandleMessage, ConnectAnyTurns, getValidPieces } from "./connectAny";

const { e } = require('../vars.json');

const ConnectStartCommand = {
    name: 'connect4',
    aliases: ['c4'],
    help: {
        category: 'games',
        brief: 'chaleng anodar pleyer to pley conect 4 wit yuo !',
        usage: 'connect4 <opponent> <piece (emoji / custom emote)>'
    },
    async execute(message, args, handler) {
        await connectAnyCommandExecute(message, args, handler, ConnectGame);
    }
} as Command;

class ConnectGame implements GridGame {
    public channel : TextChannel | undefined;
    public challenger : PieceGamePlayer;
    public opponent : PieceGamePlayer;
    public grid : ConnectGrid;
    public confirmed : boolean;
    public turns : ConnectAnyTurns;
    public message?: Message;

    constructor(channel : TextChannel, challenger : PieceGamePlayer, opponent : PieceGamePlayer, gridSize : number) {
        this.channel = channel;
        this.challenger = challenger;
        this.opponent = opponent;
        this.grid = new ConnectGrid(gridSize, gridSize - 1);
        this.confirmed = false;
        this.turns = new ConnectAnyTurns(challenger, opponent);
    }

    public destroySelf(handler : Handler): void {
        handler.games.filter(v => v.channel?.id !== this.channel?.id);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.handleMessage = async ()=>{};
        this.channel = undefined;
    }

    public async handleMessage(msg : Message, handler : Handler) : Promise<void> {
        ConnectAnyHandleMessage(msg, handler, this, async (msg, game) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            game.opponent.piece = getValidPieces(msg.content.trim())![0];
            game.confirmed = true;
            return await msg.reply({
                components: game.grid.toComponentArr(),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                content: `it's ${game.challenger.user.toString()}'s turne !! \n${game.grid.render!(game.challenger, game.opponent)}`
            });
        });
    }

    public async handleButton(interaction : ButtonInteraction, handler : Handler) : Promise<void> {
        if (interaction.user.id === this.turns.getCurrentTurnUser().id) {
            const piece = this.grid.placePiece(parseInt(interaction.customId.split('_')[1]), this.turns.currentTurn);
            if (piece) {
                if (this.grid.checkWin(piece.position, piece.placedBy)) {
                    await interaction.update({
                        components: this.grid.toComponentArr(),
                        content: `${this.turns.getCurrentTurnUser().toString()} wone !!! ${e.shock_handless.e}${e.party.e} GG !!!\n${this.grid.render(this.challenger, this.opponent)}`
                    });
                    this.destroySelf(handler);
                    return;
                }
                if (this.grid.isGridFull()) {
                    await interaction.update({
                        components: this.grid.toComponentArr(),
                        content: `it's a drawe !! GG !!! ${e.shock_handless.e}\n${this.grid.render(this.challenger, this.opponent)}`
                    });
                    this.destroySelf(handler);
                    return;
                }
                this.turns.switchTurn();
                await interaction.update({
                    components: this.grid.toComponentArr(),
                    content: `it's ${this.turns.getCurrentTurnUser().toString()}'s turne !!\n${this.grid.render(this.challenger, this.opponent)}`
                });
            }
        }
    }
}

class ConnectGrid implements ConnectAnyGrid {
    public width : number;
    public height : number;
    public pieces : ConnectPiece[];

    constructor(width : number, height : number, pieces : ConnectPiece[] = []) {
        this.width = width;
        this.height = height;
        this.pieces = pieces;
    }

    public toCharArr() : string[][] {
        const arr = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => '*'));
        for (const piece of this.pieces) {
            arr[this.height - piece.position[1] - 1][piece.position[0] - 1] = piece.placedBy;
        }
        return arr;
    }

    public toComponentArr() : MessageActionRow[] {
        const btnArr = [...Array(this.width).keys()].map(v => new MessageButton()
            .setCustomId(`connect4_${v + 1}`)
            .setEmoji(['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][v])
            .setStyle('PRIMARY')
            .setDisabled(this.toCharArr().map(v => v.join(' ')).join('\n').includes('W') || !this.columnToPosition(v + 1))
        );
        return [new MessageActionRow().addComponents(...btnArr.slice(0, 4)), new MessageActionRow().addComponents(...btnArr.slice(4))];
    }

    public render(challenger : PieceGamePlayer, opponent : PieceGamePlayer) : string {
        const grid = this.toCharArr().map(v => v.join(' ')).join('\n');
        return grid.replaceAll('*', '⚪').replaceAll('C', challenger.piece).replaceAll('O', opponent.piece).replaceAll('W', e.greneblogie.e);
    }

    public columnToPosition(column : number) : number[] | undefined {
        for (let i = 0 ; i < this.height ; i ++) {
            if (!this.pieces.some(v => v.position[0] === column && v.position[1] === i)) {
                return [column, i];
            }
        }
        return undefined;
    }

    public placePiece(column : number, placedBy : string) : ConnectPiece | undefined {
        if (this.columnToPosition(column)) {
            const piece = new ConnectPiece(column, this, placedBy);
            this.pieces.push(piece);
            return piece;
        } else {
            return undefined;
        }
    }

    public isGridFull = () : boolean => !this.toCharArr().flat(2).some(v => v === '*');
    public validateValue = (x : number, y : number) : boolean => (x > 0 && x < this.width + 1) && (y > -1 && y < this.height);
    public checkWin = (cpPos : number[], cpPlacedBy : string) : boolean => ConnectAnyCheckWin(cpPos, cpPlacedBy, this, 4);
}

class ConnectPiece implements GridGamePiece {
    public position : number[];
    public grid : ConnectGrid;
    public placedBy : string;

    constructor(column : number, grid : ConnectGrid, placedBy : string) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.position = grid.columnToPosition(column)!;
        this.grid = grid;
        this.placedBy = placedBy;
    }
}

export {ConnectStartCommand, PieceGamePlayer, ConnectAnyTurns, ConnectGame, ConnectGrid, ConnectPiece};