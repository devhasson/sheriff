import { createResponder, ResponderType } from "#base";
import { createModalFields } from "@magicyan/discord";
import { TextInputStyle } from "discord.js";

createResponder({
  customId: "config/start",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction) {
    return await interaction.showModal({
      customId: "config/channels",
      title: "Configure Sheriff Voice Manager",
      components: createModalFields({
        categoryName: {
          label: "Category Name",
          placeholder: "🔊 Voice Channels",
          maxLength: 64,
          style: TextInputStyle.Paragraph,
          required: true,
        },
        voiceChannelName: {
          label: "Creator Channel Name",
          placeholder: "➕ Create Voice Channel",
          maxLength: 64,
          style: TextInputStyle.Paragraph,
          required: true,
        },
        temporaryChannelComplement: {
          label: "Channel Name Suffix",
          placeholder: "Channel",
          maxLength: 64,
          style: TextInputStyle.Paragraph,
          required: true,
        },
      }),
    });
  },
});
