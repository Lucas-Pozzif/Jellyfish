const { addIdea, getIdea } = require("../../functions/ideas/ideas");

const userCache = require("../../data/cache/users.json");
let ideaCache = require("../../data/cache/ideas.json");

module.exports = {
    name: "discuss",
    aliases: ['disc', 'd'],
    description: ("Adiciona ideias a sua lista de ideias"),
    args: true,
    usage: '<ideaTitle> | <ideaId> | list <all>',
    discussion: true,
    async execute(msg, args, disc) {
        let discussion = ['Discussão:\n\n']
        disc.forEach(discMsg => {
            discussion.push(`**${discMsg.author.tag}**: ${discMsg.content}\n`) 
        })
        msg.channel.send(discussion.join(' '))
    },
};
