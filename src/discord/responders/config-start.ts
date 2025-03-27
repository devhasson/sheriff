import { createResponder, ResponderType } from "#base";
import { createModalFields } from "@magicyan/discord";
import { TextInputStyle } from "discord.js";

createResponder({
  customId: "config/start",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction) {
    return await interaction.showModal({
      customId: "config/setup/channels",
      title: "Configure Sheriff Voice Manager",
      components: createModalFields({
        categoryName: {
          label: "Category Name",
          placeholder: "🔊 Voice Channels",
          minLength: 3,
          maxLength: 32,
          style: TextInputStyle.Short,
          required: true,
        },
        voiceChannelName: {
          label: "Creator Channel Name",
          placeholder: "➕ Create Voice Channel",
          minLength: 3,
          maxLength: 32,
          style: TextInputStyle.Short,
          required: true,
        },
        temporaryChannelComplement: {
          label: "Channel Name Suffix",
          placeholder: "Channel",
          minLength: 2,
          maxLength: 16,
          style: TextInputStyle.Short,
          required: true,
        },
      }),
    });
  },
});
