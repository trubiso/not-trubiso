import { ButtonInteraction, Message, SelectMenuInteraction, TextChannel, User } from "discord.js";
import { Handler } from "./handler";

type GamePlayer = {
    user: User
}

interface Game {
    channel : TextChannel | undefined;
    challenger : GamePlayer;
    opponent : GamePlayer;
    confirmed : boolean;

    destroySelf(handler : Handler) : void;
    handleMessage(msg : Message, handler : Handler) : void;
    handleButton?(interaction: ButtonInteraction, handler : Handler) : void,
    handleSelectMenu?(interaction: SelectMenuInteraction, handler : Handler) : void
}

interface GameGrid {
    width : number;
    height : number;
    pieces?: GridGamePiece[];
}

interface GridGame extends Game {
    grid : GameGrid
}

interface GridGamePiece {
    position : number[];
    grid : GameGrid;
    placedBy?: string;
}

interface GameTurns {
    currentTurn: string;
}

export {GamePlayer, Game, GameGrid, GridGame, GridGamePiece, GameTurns};