const { Client, Events, GatewayIntentBits, Collection, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { doc, getDoc, setDoc } = require("firebase/firestore");
const { db } = require("./data/firebase");

const { token } = require("./config.json");
const { getUser, setUser } = require("./functions/user/user");

const  userCache  = require("./data/user-cache.json");

const c = new Client({
	intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

c.commands = new Collection();

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
	await getUser(msg.author.id);
	await executeCommand(msg);
	await setUser(msg.author.id)

});

c.login(token);

