const { getIdea } = require("../../functions/ideas/ideas");
let ideaCache = require("../../data/cache/ideas.json");

module.exports = {
    name: "lista",
    aliases: ['list', 'l'],
    description: ("Lista sua lista de ideias"),
    async execute(msg, args) {
        var ideas = userCache[msg.author.id].ideas
        let reply = `Sua lista de ideias:\n`;

        await Promise.all(ideas.map(async (ideaId) => await getIdea(ideaId)));

        ideas.forEach((ideaId) => {
            const title = ideaCache[ideaId]?.title || 'Ideia não encontrada :(';
            reply += `${ideaId}: ${title}\n`;
        });

        msg.reply(reply)
    },
};
