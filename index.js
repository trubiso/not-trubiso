const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');
const { e } = require('./vars.json');
const { loadModule } = require('./utils/loadModule.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"], allowedMentions: {parse: ["users"], repliedUser: false}});
client.commands = new Discord.Collection();
client.categories = [];
client.prefix = "<";

const categoryFiles = fs.readdirSync('./categories').filter(file => file.endsWith('.js'));

for (const file of categoryFiles) {
    loadModule(file, client);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get("717683408553377815").send(`i'm bakke!!! ${e.happy.e}`);
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