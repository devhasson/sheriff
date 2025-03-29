import {
  ChannelType,
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
  cannotTargetSelfEmbed,
  cannotTargetBotEmbed,
} from "#embeds";

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

export type ValidationResult = ValidationError | ValidationSuccess;

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

  if (member.id === interaction.user.id) {
    return {
      isValid: false,
      errorReply: {
        embeds: [cannotTargetSelfEmbed],
        withResponse: true,
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  if (member.user.bot) {
    return {
      isValid: false,
      errorReply: {
        embeds: [cannotTargetBotEmbed],
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
