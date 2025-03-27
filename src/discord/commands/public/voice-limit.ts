import { createCommand } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
} from "discord.js";

import { limitDeniedCommonUserEmbed } from "discord/embeds/limit-denied-common-user.js";
import { limitHasBeenSetEmbed } from "discord/embeds/limit-has-been-set.js";
import { notOwnerOfVoiceChannelEmbed } from "discord/embeds/not-owner-of-voice-channel.js";
import { notVoiceChannelEmbed } from "discord/embeds/not-voice-channel.js";
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

    const isBoosterUser = Boolean(interaction.member?.premiumSince);

    if (!isBoosterUser && limit > 5) {
      return interaction.reply({
        embeds: [limitDeniedCommonUserEmbed],
        ephemeral: true,
      });
    }

    const guildOnDatabase = await prisma.guild.findUnique({
      where: {
        id: interaction.guild.id,
      },
    });

    if (!guildOnDatabase) return;

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
