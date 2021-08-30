import { Client, Collection } from "discord.js";
import { Command } from "./command";
import { Module } from "./module";
import { Poll } from "./poll";

export class Handler{
    public commands: Collection<string, Command>;
    public categories: Module[];
    public prefix: string;
    public client: Client;
    public polls: Poll[];

    constructor(commands: Collection<string, Command>, categories: Module[], prefix: string, client: Client, polls: Poll[]) {
        this.commands = commands;
        this.categories = categories;
        this.prefix = prefix;
        this.client = client;
        this.polls = polls;
    }
}