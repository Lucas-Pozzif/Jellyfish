const { Client, Events, GatewayIntentBits, Collection, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { doc, getDoc, setDoc } = require("firebase/firestore");
const { db } = require("./data/firebase");

const { token } = require("./config.json");
const { getUser } = require("./functions/user/user");

const c = new Client({
	intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

c.commands = new Collection();

var userCache = {}

function commandHandler() {
	const foldersPath = path.join(__dirname, "commands");
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ("data" in command && "execute" in command) {
				c.commands.set(command.data.name, command);

			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

async function executeCommand(msg) {
	const command = c.commands.get(msg.content);
	if (command) {
		try {
			await command.execute(msg);
		} catch (err) {
			await msg.reply(`O comando **${msg.content}** não está funcionando, tente novamente mais tarde`)
		}
	}
}

c.once("ready", (bot) => {
	commandHandler();
	console.log(`${bot.user.tag} foi iniciado`);
});

c.on("messageCreate", async (msg) => {
	userCache = await getUser(msg.author.id);
	console.log('fora da funcao');
	console.log(userCache);
	executeCommand(msg);

});

c.login(token);

module.exports = { userCache }
