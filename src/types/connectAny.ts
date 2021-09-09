import { Message, MessageActionRow, TextChannel, User } from "discord.js";
import { customEmoteRegex } from "../utils/customEmoteRegex";
import { emojiRegex } from "../utils/emojiRegex";
import { mentionRegex } from "../utils/mentionRegex";
import { validateCustomEmote } from "../utils/validateCustomEmote";
import { Game, GameGrid, GameTurns, GridGame, GridGamePiece, PieceGamePlayer } from "./game";
import { Handler } from "./handler";

const { e } = require('../vars.json');

const pieceRegex = new RegExp(new RegExp(customEmoteRegex).source + '|' + new RegExp(emojiRegex).source);
const validatePiece = (piece : string, handler: Handler) : boolean => !!(piece.match(pieceRegex) && (piece.match(customEmoteRegex) ? validateCustomEmote(piece, handler) : piece.match(emojiRegex)) && piece.normalize().split('') !== '⚪'.split('') && !([':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:',':asterisk:',':hash:',':1234:',e.greneblogie.e].includes(piece)));
const getValidPieces = (piece : string) : string[] | undefined => piece.match(pieceRegex)?.map(v => v?.toString());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectAnyCommandExecute = async (message : Message, args : string[], handler : Handler, gameType : new (...args: any[]) => Game) : Promise<void> => {

    if (handler.games.some(v => v.channel?.id === message.channelId)) throw `der alredi is a gaem in dis chanel !!`;
    if (!args.length) throw `plees choos a person to chaleng !`;
    if (args.length === 1) throw `pleas choos a piec for yu to pley withe !`;
    if (args.length > 2) throw `rong amount of parameterse !`;

    const mention = args[0].match(mentionRegex);

    if (!mention) throw `mention a person propreli !!`;
    if (mention[1]) throw `yu shuld only be mentioninge wan preson`;

    let challengerPiece = args[1];

    if (!validatePiece(challengerPiece, handler)) throw `pleas input a proper emojie for yur second prameter !`;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    challengerPiece = getValidPieces(challengerPiece)![0];

    const challenger = message.author;
    const opponent = await handler.client.users.fetch(mention[0].replace(/[<@!>]/g, ''));

    if (challenger.toString() === opponent.toString()) throw `yu cant chaleng yurslef !!`;
    if (opponent.bot) throw `yu cant chaleng a bot !!`;

    handler.games.push(new gameType (message.channel as TextChannel, { user: challenger, piece: challengerPiece }, { user: opponent, piece: '' }, 7));
    
    message.reply(`${opponent.toString()}, yu hav been chalenged ! ${e.shock_handless.e} pleas choos a custom emot or emnoji ! ${e.please.e} (or tyep "cancel" to cancel de matche !) i wil be weitin ${e.stare.e}`);
    
    return;
};

interface ConnectAnyGame extends GridGame {
    channel : TextChannel | undefined;
    challenger : PieceGamePlayer;
    opponent : PieceGamePlayer;
    grid : ConnectAnyGrid;
    confirmed : boolean;
    turns : ConnectAnyTurns;
    message?: Message;
}

const ConnectAnyHandleMessage = async (msg : Message, handler : Handler, game : ConnectAnyGame, initialRender : (msg : Message, game : ConnectAnyGame) => Promise<Message> , messageCallback : (msg : Message, handler : Handler, game : ConnectAnyGame) => Promise<void> = async ()=>{return;}) : Promise<void> => {
    if (!game.confirmed) {
        if (msg.author.id === game.opponent.user.id) {
            if (validatePiece(msg.content.trim(), handler)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                if (getValidPieces(msg.content.trim())![0] === game.challenger.piece) {
                    msg.reply(`${e.think.e} yu shuldnt hav de saem piec as de odar preson !`);
                    return;
                }
                msg.reply(`${e.happy.e} started matche betweene ${game.challenger.user.toString()} ande ${game.opponent.user.toString()}!`);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                game.message = await initialRender(msg, game);
            }
        }
        if (msg.content === "cancel") {
            msg.reply(`sucesfulie canceled matche betweene ${game.challenger.user.toString()} ande ${game.opponent.user.toString()}! ${e.sad2.e} i reali waned to see yu guyse pley`);
            game.destroySelf(handler);
        }
    } else {
        if (!msg.author.bot && game.turns.validateMessage(msg) && parseInt(msg.content)) {
            await messageCallback(msg, handler, game);
        } else if (!msg.author.bot && msg.content.trim() === "cancel") {
            msg.reply(`wat a looser !! imagin bakking oute !! ${e.funny.e}${e.stare.e} (succesfuli canceled de matche ${e.sad.e})`);
            game.destroySelf(handler);
        }
    }
};

class ConnectAnyTurns implements GameTurns {
    public currentTurn : string;
    public challenger : PieceGamePlayer;
    public opponent : PieceGamePlayer;

    constructor(challenger : PieceGamePlayer, opponent : PieceGamePlayer) {
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

interface ConnectAnyPiece extends GridGamePiece {
    position : number[];
    grid : ConnectAnyGrid;
    placedBy : string;
}

interface ConnectAnyGrid extends GameGrid {
    width : number;
    height : number;
    pieces : ConnectAnyPiece[];
    
    toCharArr() : string[][];
    toComponentArr(challenger?: PieceGamePlayer, opponent?: PieceGamePlayer) : MessageActionRow[];
    render?(challenger : PieceGamePlayer, opponent : PieceGamePlayer) : string;
    columnToPosition?(column : number) : number[] | undefined;
    placePiece(c : number | number[], placedBy : string) : ConnectAnyPiece | undefined;
    isGridFull() : boolean;
    validateValue(x : number, y : number) : boolean;
}

const ConnectAnyCheckWin = (cpPos : number[], cpPlacedBy : string, grid : ConnectAnyGrid, connectNum : number) : boolean => {
    // welcome to the karlgorithm
    const directions = [ [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1] ];
    type dirObjType = {
        direction: number[],
        piecesFound: number,
        piecesFoundArr: ConnectAnyPiece[]
    }
    type axisType = {
        directions: number[][],
        piecesFound: number,
        piecesFoundArr: ConnectAnyPiece[]
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
            if (grid.validateValue(pos[0], pos[1]) && grid.pieces.find(v => v.position[0] === pos[0] && v.position[1] === pos[1])?.placedBy === cpPlacedBy) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const dirObj = dirObjs.find(v => v.direction === direction)!;
                dirObj.piecesFound++;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                dirObj.piecesFoundArr.push(grid.pieces.find(v => v.position[0] === pos[0] && v.position[1] === pos[1])!);
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
        if (paxis.piecesFound > connectNum - 2) {
            grid.pieces.forEach(v => [...paxis.piecesFoundArr.map(a => a.position), cpPos].includes(v.position) ? v.placedBy = "W" : 1);
            return true;
        }
    }
    return false;
};

export { pieceRegex, validatePiece, getValidPieces, connectAnyCommandExecute, ConnectAnyGame, ConnectAnyHandleMessage, ConnectAnyTurns, ConnectAnyPiece, ConnectAnyGrid, ConnectAnyCheckWin };