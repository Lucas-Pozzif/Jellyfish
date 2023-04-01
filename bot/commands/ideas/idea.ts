const { addIdea, getIdea } = require("../../functions/ideas/ideas");

const userCache = require("../../data/cache/users.json");
let ideaCache = require("../../data/cache/ideas.json");

const idea = {
    title: '',
    discutted: {
        at: null,
        by: [],
        for: null
    },
    created: {
        at: new Date(),
        by: ''
    },
    development: [
    ]
};


async function ideaList(msg, args) {
    if (args[0] != 'list') return

    var ideas = userCache[msg.author.id].ideas

    if (args[1] == 'all') {
    }

    await Promise.all(ideas.map(async (ideaId) => await getIdea(ideaId)));

    let reply = `Sua lista de ideias:\n`;

    ideas.forEach((ideaId) => {
        const title = ideaCache[ideaId]?.title || 'Ideia não encontrada :(';
        reply += `${ideaId}: ${title}\n`;
    });

    msg.reply(reply)
}

async function ideaAdd(msg, args) {
    if (args[0] == 'list' && args.length == 1) return
    idea.title = args.join(' ');
    idea.created.by = msg.author.id

    const ideaId = await addIdea(idea);

    userCache[msg.author.id].ideas.push(ideaId);
    await msg.reply(`A ideia **${idea.title}** foi adicionada a sua lista de ideias com o id **${ideaId}**, para debatê-la execute o comando **;discutir ${ideaId}**`);
}

module.exports = {
    name: "ideia",
    aliases: ['idea', 'i'],
    description: ("Adiciona ideias a sua lista de ideias"),
    args: true,
    usage: '<ideaTitle> | <ideaId> | list <all>',
    async execute(msg, args) {
        await ideaList(msg, args)
        await ideaAdd(msg, args)
    },
};
