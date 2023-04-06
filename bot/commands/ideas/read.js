const { getIdea } = require("../../functions/ideas/ideas");
let ideaCache = require("../../data/cache/ideas.json");

module.exports = {
    name: "ler",
    aliases: ['read', 'r'],
    description: ("Lista sua lista de ideias"),
    args: true,
    usage: '<ideaId>',
    async execute(msg, args) {

        const ideaId = args[0];
        let participants = []
        let discussion = `Discussão:`

        //Case not valid Id
        if (!await getIdea(ideaId)) {
            msg.reply('Este Id não é válido, verifique a lista de ideias com **;i list**')
            return
        }

        const ideaLog = ideaCache[ideaId].discussion

        ideaLog.forEach(async discMsg => {
            const participant = discMsg.author
            const message = discMsg.message

            if (!participants.includes(participant.username)) {
                participants.push(participant.username)
            }

            discussion += `**${participant.username}#${participant.discriminator}**: ${message}\n`
        });

        msg.reply(`A ideia selecionada foi discutida de \`${new Date(ideaLog[0].at.seconds * 1000).toLocaleString()}\` até \`${new Date(ideaLog[ideaLog.length - 1].at.seconds * 1000).toLocaleTimeString()}\`  por **${participants.join(', ')}**`)
        msg.channel.send(discussion)
    },
};
