import { Command } from "../types/command";
import { Handler } from "../types/handler";
import { Module } from "../types/module";

import fs from "fs";

/**
 * Loads a module/category into a bot handler.
 * @param file The name of the category file (should contain file extension).
 * @param handler The bot handler to load the module/category into.
 * @throws Will throw an error if the module cannot be loaded.
 */
export const loadModule = (file: string, handler: Handler) : void => {
    try {
        const category = require(`../categories/${file}`) as Module;
        const commandFiles = fs.readdirSync(`./commands/${category.name}`).filter((file: string) => file.endsWith('.js'));
        const catcomds = [];
        for (const cmdFile of commandFiles) {
            const command = require(`../commands/${category.name}/${cmdFile}`) as Command;
            handler.commands.set(command.name, command);
            catcomds.push(command);
        }
        handler.categories.push({name: file.slice(0, -3), help: category.help, commands: catcomds} as Module);
    } catch(e) {
        throw `Couldn't load module ${file}. ${e}`;
    }
};