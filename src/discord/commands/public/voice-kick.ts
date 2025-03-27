import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { createCommand } from "#base";
import { userKickedEmbed } from "discord/embeds/user-kicked.js";
import { validateVoiceCommand } from "#functions";

createCommand({
  name: "voice-kick",
  description: "Kick a user from a voice channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "User to be kicked",
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

    const { member } = validation;

    // Kick the user from voice channel
    await member.voice.disconnect();

    return interaction.reply({
      embeds: [userKickedEmbed(user)],
    });
  },
});
