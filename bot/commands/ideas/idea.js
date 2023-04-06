const { getUser } = require("../../functions/user/user");

const { addIdea, getIdea } = require("../../functions/ideas/ideas");

const userCache = require("../../data/cache/users.json");
let ideaCache = require("../../data/cache/ideas.json");

const idea = {
    title: '',
    created: {
        at: new Date(),
        by: ''
    },
    discussion: [
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
    if (args[0] == 'list' || args[0] == 'read') return
    idea.title = args.join(' ');
    idea.created.by = msg.author.id

    const ideaId = await addIdea(idea);

    userCache[msg.author.id].ideas.push(ideaId);
    await msg.reply(`A ideia **${idea.title}** foi adicionada a sua lista de ideias com o id **${ideaId}**, para debatê-la execute o comando **;discutir ${ideaId}**`);
}

async function ideaRead(msg, args) {
    if (args[0] != 'read') return

    const ideaId = args[1];

    if (!await getIdea(ideaId)) {
        msg.reply('Este Id não é válido, verifique a lista de ideias com **;i list**')
        return false
    }
    const ideaLog = ideaCache[ideaId].discussion
    let participants = []
    let discussion = `Discussão:`

    ideaLog.forEach(async discMsg => {
        const participant = discMsg.author
        const message = discMsg.message

        if (!participants.includes(participant.username)) {
            participants.push(participant.username)
        }

        discussion += `**${participant.username}#${participant.discriminator}**: ${message}\n`
    });

    msg.reply(`A ideia selecionada foi discutida de \`${new Date(ideaLog[0].at.seconds*1000).toLocaleString()}\` até \`${new Date(ideaLog[ideaLog.length - 1].at.seconds*1000).toLocaleTimeString()}\`  por **${participants.join(', ')}**`)
    msg.reply(discussion)
}

module.exports = {
    name: "ideia",
    aliases: ['idea', 'i'],
    description: ("Adiciona ideias a sua lista de ideias"),
    args: true,
    usage: '<ideaTitle> | <ideaId> | list <all>',
    async execute(msg, args) {
        await ideaList(msg, args)
        await ideaRead(msg, args)
        await ideaAdd(msg, args)
    },
};
