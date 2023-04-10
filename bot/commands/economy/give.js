const { ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const userCache = require("../../data/cache/users.json");
const { getUser } = require("../../functions/users/users")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: "dar",
	aliases: ['doar', 'give', 'g'],
	description: ("Dê uma dada quantidade de dinheiro para alguém que você goste :)"),
	args: true,
	usage: '<mention> <value>',
	async execute(msg, args) {
		const userId = msg.author.id

		const amount = parseInt(args[1])
		const mention = msg.mentions.users.first()
		const money = userCache[userId].money

		const buttons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('yes')
					.setLabel('Continuar')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('no')
					.setLabel('Cancelar')
					.setStyle(ButtonStyle.Danger),
			);

		if (isNaN(amount)) {
			return msg.reply(`O valor transferido precisa ser um número inteiro no formato ${this.usage}`)
		}
		if (amount <= 0) {
			return msg.reply(`Transfira um valor válido`)
		}
		if (money < amount) {
			return msg.reply(`Você não tem todo esse dinheiro`)
		}

		await msg.reply({ content: `Você deseja transferir ${amount} para ${mention.username}?`, components: [buttons] })

		const filter = int => int.user.id == userId;
		const collector = msg.channel.createMessageComponentCollector({ filter, time: 15000 });

		collector.on('collect', async int => {
			await int.deferUpdate();
			switch (int.customId) {
				case 'yes':
					await getUser(mention.id)

					userCache[userId].money -= amount
					userCache[mention.id].money += amount

					await int.editReply({ content: `${amount} foi transferido pra ${mention.username}`, components: [] });
					break
				case 'no':
					await int.editReply({ content: `Operação cancelada`, components: [] });
					break
				default:
					await int.editReply({ content: `Operação cancelada (erro)`, components: [] });
					break
			}
		});
	},
};