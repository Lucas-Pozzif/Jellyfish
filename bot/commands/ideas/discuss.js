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

        if (!await getIdea(ideaId)) {
            msg.reply('Este Id não é válido, verifique a lista de ideias com **;i list**')
            return false
        }
        if (!userCache[msg.author.id].ideas.includes(ideaId)) {
            msg.reply('A ideia selecionada é de outra pessoa, peça que ela inicie a discussão')
            return false
        }
        
        return true
    },
    async execute(msg, args, disc) {

        const ideaId = args[0]
        let discussion = ['Discussão:\n\n'];

        disc.forEach(discMsg => {
            const author = discMsg.author

            ideaCache[ideaId].discussion.push({
                message: discMsg.content,
                author:{
                    id: author.id,
                    username: author.username,
                    discriminator: author.discriminator
                },
                at: discMsg.createdAt
            })

            discussion.push(`**${discMsg.author.tag}**: ${discMsg.content}`)
        })

        await setIdea(ideaId)
        msg.channel.send(discussion.join('\n'))
    }
};
