import { createResponder, ResponderType } from "#base";
import { prisma } from "#database";
import { logger } from "#settings";
import { createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";

createResponder({
  customId: "config/channels",
  types: [ResponderType.ModalComponent],
  cache: "cached",
  async run(interaction) {
    const { fields, guild } = interaction;

    const categoryName = fields.getTextInputValue("categoryName");
    const voiceChannelName = fields.getTextInputValue("voiceChannelName");
    const temporaryChannelComplement = fields.getTextInputValue(
      "temporaryChannelComplement"
    );

    try {
      await prisma.guild.upsert({
        where: { id: guild.id },
        update: {
          categoryName,
          voiceChannelName,
          temporaryChannelComplement,
          deletedAt: null,
        },
        create: {
          id: guild.id,
          categoryName,
          voiceChannelName,
          temporaryChannelComplement,
        },
      });

      logger.success(`Guild ${guild.id} created on database.`);
    } catch (error) {
      logger.error(error);
      return await interaction.reply({
        content:
          "An error occurred while creating the guild. Please, try again later.",
        ephemeral: true,
      });
    }

    const category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
      ],
    });

    await guild.channels.create({
      name: voiceChannelName,
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
