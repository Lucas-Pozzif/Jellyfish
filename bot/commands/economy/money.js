const userCache = require("../../data/cache/users.json");

module.exports = {
  name: "conta",
  aliases: ['money', 'm', 'account'],
  description: ("Adiciona ideias a sua lista de ideias"),

  async execute(msg) {
    const money = userCache[msg.author.id].money;

    await msg.reply(`money: ${money}`);
  },
};
