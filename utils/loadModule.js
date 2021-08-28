const fs = require('fs');

module.exports = {
    loadModule(file, client) {
        try {
            const category = require(`../categories/${file}`);
            const commandFiles = fs.readdirSync(`./commands/${category.name}`).filter(file => file.endsWith('.js'));
            let catcomds = [];
            for (const cmdFile of commandFiles) {
                const command = require(`../commands/${category.name}/${cmdFile}`);
                client.commands.set(command.name, command);
                catcomds.push(command);
            }
            client.categories.push({name: file.slice(0, -3), help: category.help, commands: catcomds});
        } catch(e) {
            throw `Couldn't load module ${file}. ${e}`;
        }
    }
}