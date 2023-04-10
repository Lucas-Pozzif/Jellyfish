const { ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const userCache = require("../../data/cache/users.json");
const { getUser } = require("../../functions/users/users")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "moeda",
    aliases: ['flip', 'f'],
    description: ("Gire a moeda e tente a sorte"),
    args: true,
    usage: '<amount>',
    async execute(msg, args) {
        const userId = msg.author.id

        const amount = parseInt(args[0])
        const money = userCache[userId].money

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('heads')
                    .setLabel('Cara')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('tails')
                    .setLabel('Coroa')
                    .setStyle(ButtonStyle.Primary),
            );

        if (isNaN(amount)) {
            return msg.reply(`O valor precisa ser um número`)
        }
        if (amount <= 0) {
            return msg.reply(`Aposte um valor válido`)
        }
        if (money < amount) {
            return msg.reply(`Você não tem todo esse dinheiro`)
        }

        await msg.reply({ content: `Você apostou ${amount}, escolha entre cara ou coroa`, components: [buttons] })

        const filter = int => int.user.id == userId;
        const collector = msg.channel.createMessageComponentCollector({ filter, time: 3000 });

        collector.on('collect', async int => {
            await int.deferUpdate();

            const coin = Math.floor(Math.random() * 2)

            switch (int.customId) {
                case 'heads':
                    if (coin == 0) {
                        userCache[userId].money -= amount

                        await int.editReply({ content: `Você perdeu`, components: [] });
                    } else {
                        userCache[userId].money += amount

                        await int.editReply({ content: `Você venceu`, components: [] });
                    }
                    break
                case 'tails':
                    if (coin == 1) {
                        userCache[userId].money -= amount

                        await int.editReply({ content: `Você perdeu`, components: [] });
                    } else {
                        userCache[userId].money += amount

                        await int.editReply({ content: `Você venceu`, components: [] });
                    }
                    break
                default:
                    await int.editReply({ content: `Aposta cancelada (erro)`, components: [] });
                    break
            }
        });
    },
};