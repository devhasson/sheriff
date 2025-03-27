import { createCommand } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { voiceChannelTransferredEmbed } from "discord/embeds/voice-channel-transferred.js";
import { validateVoiceCommand } from "#functions";

createCommand({
  name: "voice-transfer",
  description: "Transfer a ownership of the voice channel to another user",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "User to transfer the ownership to",
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

    const { voiceChannel, guildData } = validation;

    // Transfer ownership by changing channel name
    await voiceChannel.edit({
      name: `${user.username}'s - ${guildData.temporaryChannelComplement}`,
    });

    return interaction.reply({
      embeds: [voiceChannelTransferredEmbed(user)],
    });
  },
});
