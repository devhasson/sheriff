import { createEmbed } from "@magicyan/discord";
import {
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Colors,
  Guild,
  User,
} from "discord.js";
import { prisma } from "#database";
import { notOwnerOfVoiceChannelEmbed } from "discord/embeds/not-owner-of-voice-channel.js";
import { notVoiceChannelEmbed } from "discord/embeds/not-voice-channel.js";
import { userNotFoundEmbed } from "discord/embeds/user-not-found.js";

/**
 * Creates a standardized embed with consistent styling
 */
export function createStandardEmbed({
  title,
  description,
  color = Colors.Blue,
  thumbnail,
  timestamp = true,
}: {
  title: string;
  description: string;
  color?: number;
  thumbnail?: string;
  timestamp?: boolean;
}) {
  return createEmbed({
    title,
    description,
    color,
    thumbnail: thumbnail ? { url: thumbnail } : undefined,
    footer: { text: "Sheriff Voice Manager" },
    timestamp: timestamp ? new Date() : undefined,
  });
}

/**
 * Creates a user action embed (kick, ban, etc)
 */
export function createUserActionEmbed({
  user,
  action,
  actionTitle,
  color,
}: {
  user: User;
  action: string;
  actionTitle: string;
  color: number;
}) {
  return createStandardEmbed({
    title: actionTitle,
    description: `**${user.displayName}** ${action}`,
    color,
    thumbnail: user.displayAvatarURL({ extension: "png" }) || "",
  });
}

/**
 * Creates a button with standard styling
 */
export function createStandardButton({
  id,
  label,
  emoji,
  style = ButtonStyle.Primary,
}: {
  id: string;
  label: string;
  emoji?: string;
  style?:
    | ButtonStyle.Primary
    | ButtonStyle.Secondary
    | ButtonStyle.Success
    | ButtonStyle.Danger
    | ButtonStyle.Premium
    | undefined;
}) {
  return new ButtonBuilder({
    customId: id,
    label,
    emoji,
    style: style,
  });
}

/**
 * Creates a configuration step button
 */
export function createConfigButton({
  step,
  label,
  emoji,
  style = ButtonStyle.Primary,
}: {
  step: string;
  label: string;
  emoji?: string;
  style?:
    | ButtonStyle.Primary
    | ButtonStyle.Secondary
    | ButtonStyle.Success
    | ButtonStyle.Danger
    | ButtonStyle.Premium
    | undefined;
}) {
  return createStandardButton({
    id: `config/${step}`,
    label,
    emoji,
    style,
  });
}

/**
 * Get guild thumbnail URL
 */
export function getGuildThumbnail(guild: Guild): string {
  return guild.iconURL({ extension: "png" }) || "";
}

/**
 * Validates if the interaction is in a voice channel and the user is the owner
 * Used to reduce repetition in voice channel commands
 */
export async function validateVoiceCommand(interaction: any, targetUser: User) {
  if (!interaction.guild) return { isValid: false };

  const channel = interaction.channel;
  if (channel?.type !== ChannelType.GuildVoice) {
    return {
      isValid: false,
      errorReply: {
        embeds: [notVoiceChannelEmbed],
        ephemeral: true,
      },
    };
  }

  const member = await interaction.guild?.members
    .fetch(targetUser.id)
    .catch(() => null);
  if (!member) {
    return {
      isValid: false,
      errorReply: {
        embeds: [userNotFoundEmbed],
        ephemeral: true,
      },
    };
  }

  const guildOnDatabase = await prisma.guild.findUnique({
    where: { id: interaction.guild.id },
  });

  if (!guildOnDatabase) return { isValid: false };

  const isOwnerOfChannel =
    channel.name ===
    `${interaction.user.username}'s - ${guildOnDatabase.temporaryChannelComplement}`;

  if (!isOwnerOfChannel) {
    return {
      isValid: false,
      errorReply: {
        embeds: [notOwnerOfVoiceChannelEmbed],
        ephemeral: true,
      },
    };
  }

  return {
    isValid: true,
    voiceChannel: channel,
    member,
    guildData: guildOnDatabase,
  };
}
