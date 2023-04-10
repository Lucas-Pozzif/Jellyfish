const { Client, Events, GatewayIntentBits, Collection, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const { token } = require("./config.json");
const { getUser, setUser } = require("./functions/users/users");

let userCache = require('./data/cache/users.json');

const c = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent
	],
});

c.commands = new Collection();

function commandHandler() {
	const foldersPath = path.join(__dirname, "commands");
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ("name" in command && "execute" in command) {
				c.commands.set(command.name, command);

			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

async function executeCommand(msg) {
	if (!msg.content.startsWith(';')) return;
	if (msg.author.bot) return;

	const args = msg.content
		.slice(1)
		.trim()
		.split(/ +/);
	const discussion = []
	const commandName = args.shift().toLowerCase()
	const now = new Date()
	const userId = msg.author.id
	const user = userCache[userId]
	const command = c.commands.get(commandName)
		|| c.commands.find(command => command.aliases && command.aliases.includes(commandName))

	if (command) {
		const cooldown = command.cooldown | 0

		if (user.cooldowns?.[command.name]?.seconds) {
			user.cooldowns[command.name] = (user.cooldowns[command.name].seconds * 1000)
		}

		if (user.cooldowns?.[command.name] > now) {
			const remainingCooldown = new Date(user.cooldowns[command.name] - now)
			remainingCooldown.setHours(remainingCooldown.getHours() + remainingCooldown.getTimezoneOffset() / 60)

			return msg.reply(`Você precisa esperar ${remainingCooldown.toLocaleTimeString()} pra que esse comando possa ser executado novamente`)
		}


		//stops you if it needs arguments
		if (command.args && !args.length) {
			let noArgs = `Este comando precisa de argumentos! `
			if (command.usage) {
				noArgs += `O uso correto é **;${command.name} ${command.usage}**`
			}
			return msg.reply(noArgs)
		}

		//run a discussion model if the command has discussion attribute
		if (command.discussion) {
			discussionCollector(msg, args, discussion, command)

		} else {
			try {
				await command.execute(msg, args);

			} catch (err) {
				console.log(err)
				await msg.reply(`O comando **${command.name}** não está funcionando, tente novamente mais tarde`)
			}
		}
		user.cooldowns[command.name] = new Date(now.getTime() + cooldown * 60000)

	}
}

async function discussionCollector(msg, args, discussion, command) {
	if (command.validator) {
		if (!await command.validator(msg, args)) {
			console.log('isso não passou no validador')
			return
		}
	}
	msg.channel.send(`O comando **${command.name}** iniciou uma discussão, para encerrá-la digite **;encerrar**`)

	const collector = msg.channel.createMessageCollector(discMsg => { discMsg.channel.id === msg.channel.id, { time: 0 } });
	collector.on('collect', async discMsg => {
		if (discMsg.author.bot) {
			discMsg.react('🤖');
			discMsg.react('📩');
		}

		if (discMsg.content == ';encerrar') {
			discMsg.react('📨')
			collector.stop();
			return
		}
		discussion.push(discMsg);
		discMsg.react('📩')

	})
	collector.on('end', async () => {
		try {
			await command.execute(msg, args, discussion);

		} catch (err) {
			console.log(err)
			await msg.reply(`O comando **${msg.content}** não está funcionando, tente novamente mais tarde`)
		}
	});
}

c.once("ready", (bot) => {
	commandHandler();
	console.log(`${bot.user.tag} foi iniciado`);
});

c.on("messageCreate", async (msg) => {
	const userId = msg.author.id

	await getUser(userId);
	await executeCommand(msg);
	await setUser(userId)

});

c.login(token);

module.exports = { c }