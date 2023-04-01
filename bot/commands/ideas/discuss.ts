const { getIdea, setIdea } = require("../../functions/ideas/ideas");

const userCache = require("../../data/cache/users.json");
let ideaCache = require("../../data/cache/ideas.json");

module.exports = {
    name: "discutir",
    aliases: ['discuss', 'disc', 'd'],
    description: ("Adiciona ideias a sua lista de ideias"),
    args: true,
    usage: '<ideaId>',
    discussion: true,
    async validator(msg, args) {
        const ideaId = args[0];

        if (isNaN(ideaId)) {
            msg.reply('o comando discutir exige um id numérico');
            return false
        }

        await getIdea(ideaId)
        if(!ideaCache[ideaId]){
            msg.reply('essa ideia nao existe')
            return false
        }
        return true

    },
    async execute(msg, args, disc) {

        const ideaId = args[0]
        let discussion = ['Discussão:\n\n'];

        disc.forEach(discMsg => {
            ideaCache[ideaId].discussion.push({
                message: discMsg.content,
                authorId: discMsg.author.id,
                at: discMsg.createdAt
            })

            discussion.push(`**${discMsg.author.tag}**: ${discMsg.content}`)
        })

        await setIdea(ideaId)
        msg.channel.send(discussion.join('A discussão foi salva!'))
    }
};
