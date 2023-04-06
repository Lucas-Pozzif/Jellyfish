const userCache = require("../../data/cache/users.json");

module.exports = {
  name: "diário",
  aliases: ['diario', 'daily', 'd'],
  description: ("Saque o seu prêmio diário"),
  cooldown: 24 * 60,
  async execute(msg) {
    const userId = msg.author.id
    let money = userCache[userId].money
    money += 100;

    await msg.reply(`te demos dinheiro grátis, espere 1 dia para pedir denovo (pidão): $${money}`);
  },
};
