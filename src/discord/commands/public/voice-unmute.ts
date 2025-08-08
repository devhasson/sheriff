import { createCommand } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { userUnmutedEmbed } from "#embeds";
import { validateVoiceCommand } from "#functions";

createCommand({
  name: "voice-unmute",
  description: "Unmute a user in the voice channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "User to be unmuted",
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

    const { member } = validation;

    await member.voice.setMute(false);

    return interaction.reply({
      embeds: [userUnmutedEmbed(user)],
    });
  },
});
