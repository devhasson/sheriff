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
    const temporaryChannelComplement = fields.getTextInputValue(
      "temporaryChannelComplement"
    );

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
      await prisma.guild.upsert({
        where: { id: guild.id },
        update: {
          categoryName: category.name,
          voiceChannelName: voiceChannel.name,
          temporaryChannelComplement,
          deletedAt: null,
        },
        create: {
          id: guild.id,
          categoryName: category.name,
          voiceChannelName: voiceChannel.name,
          temporaryChannelComplement,
        },
      });
    } catch (error) {
      logger.error(error);
      return await interaction.reply({
        content: "Error on guild configuration.",
        ephemeral: true,
      });
    }

    await guild.channels.create({
      name: category.name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
      ],
    });

    await guild.channels.create({
      name: voiceChannel.name,
      type: ChannelType.GuildVoice,
      parent: category,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ["ViewChannel", "Connect"],
          deny: ["Speak", "SendMessages", "ReadMessageHistory"],
        },
      ],
    });

    return await interaction.update({
      components: [
        createRow(
          new ButtonBuilder({
            customId: "config/complete",
            label: "Continue Setup",
            emoji: "✅",
            style: ButtonStyle.Success,
          })
        ),
      ],
    });
  },
});
