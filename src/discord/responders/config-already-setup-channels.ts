import { createResponder, ResponderType } from "#base";
import { prisma } from "#database";
import { logger } from "#settings";
import { createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";

createResponder({
  customId: "config/already-setup/channels",
  types: [ResponderType.ModalComponent],
  cache: "cached",
  async run(interaction) {
    const { fields, guild } = interaction;

    const categoryId = fields.getTextInputValue("categoryId");
    const voiceChannelId = fields.getTextInputValue("voiceChannelId");

    const category = await guild.channels.fetch(categoryId);

    if (!category || category.type !== ChannelType.GuildCategory) {
      return await interaction.reply({
        content: "Invalid category ID.",
        ephemeral: true,
      });
    }

    const voiceChannel = await guild.channels.fetch(voiceChannelId);

    if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
      return await interaction.reply({
        content: "Invalid voice channel ID.",
        ephemeral: true,
      });
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.guild.upsert({
          where: { id: guild.id },
          create: {
            id: guild.id,
          },
          update: {
            deletedAt: null,
          },
        });
        await tx.guildConfig.update({
          where: { guildId: guild.id },
          data: {
            categoryName: category.name,
            voiceChannelName: voiceChannel.name,
          },
        });
      });
    } catch (error) {
      logger.error(error);
      return await interaction.reply({
        content: "Error on guild configuration.",
        ephemeral: true,
      });
    }

    return await interaction.update({
      components: [
        createRow(
          new ButtonBuilder({
            customId: "config/limits",
            label: "Continue Setup",
            emoji: "✅",
            style: ButtonStyle.Success,
          })
        ),
      ],
    });
  },
});
