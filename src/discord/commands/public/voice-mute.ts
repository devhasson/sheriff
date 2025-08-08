import { createCommand } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { userMutedEmbed } from "#embeds";
import { validateVoiceCommand } from "#functions";

createCommand({
  name: "voice-mute",
  description: "Mute a user in the voice channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "User to be muted",
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

    await member.voice.setMute(true);

    return interaction.reply({
      embeds: [userMutedEmbed(user)],
    });
  },
});
