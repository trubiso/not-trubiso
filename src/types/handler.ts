import { Client, Collection } from "discord.js";
import { Command } from "./command";
import { Module } from "./module";

export class Handler{
    public commands: Collection<string, Command>;
    public categories: Module[];
    public prefix: string;
    public client: Client;

    constructor(commands: Collection<string, Command>, categories: Module[], prefix: string, client: Client) {
        this.commands = commands;
        this.categories = categories;
        this.prefix = prefix;
        this.client = client;
    }
}