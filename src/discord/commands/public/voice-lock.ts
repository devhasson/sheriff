import { createCommand } from "#base";
import { ApplicationCommandType, ChannelType } from "discord.js";
import {
  channelLockedEmbed,
  notOwnerOfVoiceChannelEmbed,
  notVoiceChannelEmbed,
  sheriffNotConfiguredEmbed,
} from "#embeds";
import { prisma } from "#database";

createCommand({
  name: "voice-lock",
  description: "Lock the voice channel to prevent new users from joining",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const channel = interaction.channel;

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      return interaction.reply({
        embeds: [notVoiceChannelEmbed],
        ephemeral: true,
      });
    }

    const guildData = await prisma.guild.findUnique({
      where: { id: interaction.guild.id },
    });

    if (!guildData) {
      return interaction.reply({
        embeds: [sheriffNotConfiguredEmbed],
        ephemeral: true,
      });
    }

    const isOwner =
      channel.name ===
      `${interaction.user.username}'s - ${guildData.temporaryChannelComplement}`;

    if (!isOwner) {
      return interaction.reply({
        embeds: [notOwnerOfVoiceChannelEmbed],
        ephemeral: true,
      });
    }

    await channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { Connect: false }
    );

    return interaction.reply({
      embeds: [channelLockedEmbed],
    });
  },
});
