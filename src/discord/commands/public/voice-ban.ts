import { createCommand } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionFlagsBits,
} from "discord.js";
import { userBannedEmbed } from "#embeds";
import { validateVoiceCommand } from "#functions";

createCommand({
  name: "voice-ban",
  description: "Bans a user from a voice channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "User to be banned",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run(interaction) {
    const { options } = interaction;
    const user = options.getUser("user", true);

    const validation = await validateVoiceCommand(interaction, user);

    if (!validation.isValid) {
      return validation.errorReply
        ? interaction.reply(validation.errorReply)
        : null;
    }

    const { voiceChannel } = validation;

    await voiceChannel.edit({
      permissionOverwrites: [
        {
          id: user.id,
          deny: [PermissionFlagsBits.Connect],
        },
      ],
    });

    return interaction.reply({
      embeds: [userBannedEmbed(user)],
    });
  },
});
