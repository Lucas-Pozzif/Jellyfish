const { userCache } = require("../../");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("money").setDescription("Tells you how much money you have on your account"),

  async execute(interaction) {
    console.log(userCache);

    await interaction.reply(userCache.money);
  },
};
