const userCache = require("../../data/user-cache.json");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("money").setDescription("Tells you how much money you have on your account"),

  async execute(msg) {
    userCache[msg.author.id].money ++
    const money = userCache[msg.author.id].money;

    await msg.reply(`money: ${money}`);
  },
};
