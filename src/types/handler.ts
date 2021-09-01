import { Client, Collection } from "discord.js";
import { Command } from "./command";
import { ConnectGame } from "./connect";
import { Module } from "./module";
import { Poll } from "./poll";

/**
 * The bot handler. Contains properties to store variables and use them across the bot.
 */
export class Handler{
    /**
     * Collection of all commands.
     */
    public commands: Collection<string, Command>;
    /**
     * Collection of all categories.
     */
    public categories: Module[];
    /**
     * The global bot prefix.
     */
    public prefix: string;
    /**
     * The bot's client.
     */
    public client: Client;
    /**
     * Collection of all polls that aren't closed and are accessible.
     */
    public polls: Poll[];
    /**
     * Collection of all Connect 4 games currently ongoing.
     */
    public connectGames : ConnectGame[];

    /**
     * @param commands Collection of all commands.
     * @param categories Collection of all categories.
     * @param prefix Default global prefix.
     * @param client Bot client object.
     * @param polls Poll array.
     */
    constructor(commands: Collection<string, Command>, categories: Module[], prefix: string, client: Client, polls: Poll[], connectGames : ConnectGame[]) {
        this.commands = commands;
        this.categories = categories;
        this.prefix = prefix;
        this.client = client;
        this.polls = polls;
        this.connectGames = connectGames;
    }
}