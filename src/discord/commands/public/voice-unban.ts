import { createCommand } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionFlagsBits,
} from "discord.js";
import { userUnbannedEmbed } from "discord/embeds/user-unbanned.js";
import { validateVoiceCommand } from "#functions";

createCommand({
  name: "voice-unban",
  description: "Unbans a user from a voice channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "User to be unbanned",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run(interaction) {
    const { options } = interaction;
    const user = options.getUser("user", true);

    // Validate voice channel command requirements
    const validation = await validateVoiceCommand(interaction, user);

    if (!validation.isValid) {
      return validation.errorReply
        ? interaction.reply(validation.errorReply)
        : null;
    }

    const { voiceChannel } = validation;

    // Unban the user from the voice channel
    await voiceChannel.edit({
      permissionOverwrites: [
        {
          id: user.id,
          allow: [PermissionFlagsBits.Connect],
        },
      ],
    });

    return interaction.reply({
      embeds: [userUnbannedEmbed(user)],
    });
  },
});
