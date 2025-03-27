import { createResponder } from "#base";
import { ResponderType } from "#base";
import { prisma } from "#database";

createResponder({
  customId: "config/cleanup",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction) {
    const { guild } = interaction;

    const guildOnDatabase = await prisma.guild.findUnique({
      where: { id: guild.id },
    });

    if (!guildOnDatabase) {
      return await interaction.reply({
        content:
          "Something went wrong. Please contact the support team at davihasson@gmail.com",
        ephemeral: true,
      });
    }

    const configurationChannel = guild.channels.cache.find(
      (channel) => channel.name === "sheriff-onboarding"
    );

    if (!configurationChannel) {
      return await interaction.reply({
        content:
          "Something went wrong. Please contact the support team at davihasson@gmail.com",
        ephemeral: true,
      });
    }

    return await configurationChannel.delete();
  },
});
