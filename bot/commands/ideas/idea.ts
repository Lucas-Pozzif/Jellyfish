const { setIdea } = require("../../functions/ideas/ideas");

const userCache = require("../../data/cache/users.json");

module.exports = {
    name: "ideia",
    aliases: ['idea', 'i'],
    description: ("Adiciona ideias a sua lista de ideias"),
    args: true,
    usage: '<ideaTitle>',
    async execute(msg, args) {
        const ideaTitle = args.join(' ')
        const idea = {
            title: ideaTitle,
            discutted:{
                at: null,
                by: [],
                for: null
            },
            created: {
                at: new Date(),
                by: msg.author.id
            },
            development: [
            ]
        };

        const ideaId = await setIdea(idea);

        await userCache[msg.author.id].ideas.push(ideaId);
        await msg.reply(`A ideia **${ideaTitle}** foi adicionada a sua lista de ideias com o id **${ideaId}**, para debatê-la execute o comando **;discutir ${ideaId}**`);
    },
};
