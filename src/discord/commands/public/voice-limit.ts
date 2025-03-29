import { createCommand } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
} from "discord.js";

import {
  limitDeniedCommonUserEmbed,
  limitDeniedBoosterUserEmbed,
  limitHasBeenSetEmbed,
  notOwnerOfVoiceChannelEmbed,
  notVoiceChannelEmbed,
} from "#embeds";
import { prisma } from "#database";

createCommand({
  name: "voice-limit",
  description: "Set the limit of the voice channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "limit",
      description: "The limit of the voice channel",
      type: ApplicationCommandOptionType.Integer,
      min_value: 2,
      required: true,
    },
  ],
  async run(interaction) {
    const { options } = interaction;
    const limit = options.getInteger("limit", true);
    const channel = interaction.channel;

    if (channel?.type !== ChannelType.GuildVoice) {
      return interaction.reply({
        embeds: [notVoiceChannelEmbed],
        ephemeral: true,
      });
    }

    const guildOnDatabase = await prisma.guild.findUnique({
      where: {
        id: interaction.guild.id,
      },
    });

    if (!guildOnDatabase) return;

    const isBoosterUser = Boolean(interaction.member?.premiumSince);

    if (!isBoosterUser && limit > guildOnDatabase.channelLimitForNormalUsers) {
      return interaction.reply({
        embeds: [limitDeniedCommonUserEmbed],
        ephemeral: true,
      });
    }

    if (isBoosterUser && limit > guildOnDatabase.channelLimitForBoosters) {
      return interaction.reply({
        embeds: [
          limitDeniedBoosterUserEmbed(guildOnDatabase.channelLimitForBoosters),
        ],
        ephemeral: true,
      });
    }

    const isOwnerOfChannel =
      channel?.name ===
      `${interaction.user.username}'s - ${guildOnDatabase.temporaryChannelComplement}`;

    if (!isOwnerOfChannel) {
      return interaction.reply({
        embeds: [notOwnerOfVoiceChannelEmbed],
        ephemeral: true,
      });
    }

    await channel.edit({ userLimit: limit });

    return interaction.reply({
      embeds: [limitHasBeenSetEmbed(limit)],
    });
  },
});
