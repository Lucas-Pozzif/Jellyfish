const { ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const userCache = require("../../data/cache/users.json");
const { getUser } = require("../../functions/users/users")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "pedra papel tesoura",
    aliases: ['pedrapapeltesoura', 'rockpaperscissors', 'ppt', 'rps'],
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
                    .setCustomId('rock')
                    .setLabel('Pedra')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('paper')
                    .setLabel('Papel')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('scissors')
                    .setLabel('Tesoura')
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

        await msg.reply({ content: `Você apostou ${amount}, escolha entre pedra, papel ou tesoura`, components: [buttons] })

        const filter = int => int.user.id == userId;
        const collector = msg.channel.createMessageComponentCollector({ filter, time: 5000 });

        collector.on('collect', async int => {
            await int.deferUpdate();

            const cpuChoice = Math.floor(Math.random() * 3)
            var result = 0

            switch (int.customId) {
                //rock = 0, paper = 1, scissors = 2
                case 'rock':
                    switch (cpuChoice) {
                        case 0:
                            result = 0
                            break;
                        case 1:
                            result = 1
                            break;
                        case 2:
                            result = 2
                            break;
                        default:
                            result = 3
                            break;
                    }
                    break
                case 'paper':
                    switch (cpuChoice) {
                        case 0:
                            result = 2
                            break;
                        case 1:
                            result = 0
                            break;
                        case 2:
                            result = 1
                            break;
                        default:
                            result = 3
                            break;
                    }

                case 'scissors':
                    switch (cpuChoice) {
                        case 0:
                            result = 1
                            break;
                        case 1:
                            result = 2
                            break;
                        case 2:
                            result = 0
                            break;
                        default:
                            result = 3
                            break;
                    }
                default:
                    result = 3
                    break
            }

            switch (result) {
                case 0:
                    msg.reply(`empate, ${userId}, ${cpuChoice}`)
                    break;

                case 1:
                    msg.reply(`derrota, ${userId}, ${cpuChoice}`)
                    break;

                case 2:
                    msg.reply(`vitória, ${userId}, ${cpuChoice}`)
                    break;

                case 3:
                    msg.reply(`erro, ${userId}, ${cpuChoice}`)
                    break;


                default:
                    break;
            }

        });
    },
};