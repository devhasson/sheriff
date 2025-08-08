import { createCommand } from "#base";
import { ApplicationCommandType, ChannelType } from "discord.js";
import {
  channelUnlockedEmbed,
  notOwnerOfVoiceChannelEmbed,
  notVoiceChannelEmbed,
  sheriffNotConfiguredEmbed,
} from "#embeds";
import { prisma } from "#database";

createCommand({
  name: "voice-unlock",
  description: "Unlock the voice channel allowing new users to join",
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
      { Connect: true }
    );

    return interaction.reply({
      embeds: [channelUnlockedEmbed],
    });
  },
});
