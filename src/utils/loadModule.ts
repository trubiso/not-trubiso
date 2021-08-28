import { Command } from "../types/command";
import { Handler } from "../types/handler";
import { Module } from "../types/module";

import fs from "fs"

export const loadModule = (file: string, handler: Handler) : void => {
    try {
        const category = require(`../categories/${file}`) as Module;
        const commandFiles = fs.readdirSync(`./commands/${category.name}`).filter((file: string) => file.endsWith('.js'));
        let catcomds = [];
        for (const cmdFile of commandFiles) {
            const command = require(`../commands/${category.name}/${cmdFile}`) as Command;
            handler.commands.set(command.name, command);
            catcomds.push(command);
        }
        handler.categories.push({name: file.slice(0, -3), help: category.help, commands: catcomds} as Module);
    } catch(e) {
        throw `Couldn't load module ${file}. ${e}`;
    }
}