const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');
const { e } = require('./vars.json');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] });
client.commands = new Discord.Collection();
client.categories = [];
client.prefix = "<";

const categoryFiles = fs.readdirSync('./categories').filter(file => file.endsWith('.js'));

for (const file of categoryFiles) {
    const category = require(`./categories/${file}`);
    const commandFiles = fs.readdirSync(`./commands/${category.name}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${category.name}/${file}`);
        client.commands.set(command.name, command);
    }
    let catcomds = [];
    client.commands.forEach(v=>{
        if (v.help.category) if (v.help.category == file.slice(0, -3)) catcomds.push(v);
    });
    let o = {name: file.slice(0, -3), help: category.help, commands: catcomds};
    client.categories.push(o);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// client.on('guildMemberAdd', member => {
//     if (member.guild.id == 717683408012181505)
//         member.roles.add(member.guild.roles.get(choose("725843105445576796", "725843316662468641")));
// });

client.on('messageCreate', msg => {
    if (!msg.content.startsWith(client.prefix) && !msg.mentions.everyone) {
        if (msg.mentions.has(client.user)) {
            msg.react("👋");
            msg.react(e.happy.id);
        }
        if (msg.content.includes("busines")) {
            msg.react(e.business.id);
        }
        return;
    } else if (!msg.author.bot && msg.content.startsWith(client.prefix)) {
        const args = msg.content.slice(client.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (client.commands.get(command)) {
            try {
                client.commands.get(command).execute(msg, args, client);
            } catch (error) {
                msg.channel.send(`${e.shock_handless.e} ther was an eror executinge yuor comande !! ${e.sad.e} ${error.toString()}`);
            }
        } else {
            var suitable = [...client.commands.filter(v => (v.aliases ?? []).includes(command))];
            if (suitable) {
                try { suitable[0][1].execute(msg, args, client) } catch(e) {};
            }
        }
    }
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(token);