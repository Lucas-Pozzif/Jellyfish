const { addIdea } = require("../../functions/ideas/ideas");

const userCache = require("../../data/cache/users.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const idea = {
    title: '',
    created: {
        at: new Date(),
        by: ''
    },
    discussion: [
    ]
};

module.exports = {
    name: "ideia",
    aliases: ['idea', 'i'],
    description: ("Adiciona ideias a sua lista de ideias"),
    args: true,
    usage: '<ideaTitle> | <ideaId> | list <all>',
    async execute(msg, args) {
        idea.title = args.join(' ');
        idea.created.by = msg.author.id
        const ideaId = await addIdea(idea);

        userCache[msg.author.id].ideas.push(ideaId);

        await msg.reply(`A ideia **${idea.title}** foi adicionada a sua lista de ideias com o id **${ideaId}**, para debatê-la execute o comando **;discutir ${ideaId}**`);
    },
};
