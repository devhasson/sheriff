import { createEmbed } from "@magicyan/discord";
import {
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Colors,
  Guild,
  GuildMember,
  Interaction,
  InteractionReplyOptions,
  MessageFlags,
  User,
  VoiceChannel,
} from "discord.js";
import { prisma, Guild as GuildModel } from "#database";
import {
  notOwnerOfVoiceChannelEmbed,
  notVoiceChannelEmbed,
  userNotFoundEmbed,
} from "#embeds";

/**
 * Creates a standardized embed with consistent styling
 */
export function createStandardEmbed({
  title,
  description,
  color = Colors.Blue,
  thumbnail,
  timestamp = false,
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
    description: `**@${user.displayName}** ${action}`,
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

interface ValidationError {
  isValid: false;
  errorReply: InteractionReplyOptions & {
    withResponse: true;
  };
}

interface ValidationSuccess {
  isValid: true;
  member: GuildMember;
  voiceChannel: VoiceChannel;
  guildData: GuildModel;
}

type ValidationResult = ValidationError | ValidationSuccess;

/**
 * Validates if the interaction is in a voice channel and the user is the owner
 * Used to reduce repetition in voice channel commands
 */
export async function validateVoiceCommand(
  interaction: Interaction,
  targetUser: User
): Promise<ValidationResult> {
  if (!interaction.guild) {
    return {
      isValid: false,
      errorReply: {
        embeds: [notVoiceChannelEmbed],
        flags: MessageFlags.Ephemeral,
        withResponse: true,
      },
    };
  }

  const channel = interaction.channel;

  if (!channel || channel.type !== ChannelType.GuildVoice) {
    return {
      isValid: false,
      errorReply: {
        embeds: [notVoiceChannelEmbed],
        flags: MessageFlags.Ephemeral,
        withResponse: true,
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
        withResponse: true,
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  const guildOnDatabase = await prisma.guild.findUnique({
    where: { id: interaction.guild.id },
  });

  if (!guildOnDatabase) {
    return {
      isValid: false,
      errorReply: {
        embeds: [notVoiceChannelEmbed],
        flags: MessageFlags.Ephemeral,
        withResponse: true,
      },
    };
  }

  const isOwnerOfChannel =
    channel.name ===
    `${interaction.user.username}'s - ${guildOnDatabase.temporaryChannelComplement}`;

  if (!isOwnerOfChannel) {
    return {
      isValid: false,
      errorReply: {
        embeds: [notOwnerOfVoiceChannelEmbed],
        withResponse: true,
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  return {
    isValid: true,
    member,
    voiceChannel: channel,
    guildData: guildOnDatabase,
  };
}
