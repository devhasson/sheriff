import { createResponder, ResponderType } from "#base";
import { createModalFields } from "@magicyan/discord";
import { TextInputStyle } from "discord.js";

createResponder({
  customId: "config/already-setup",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction) {
    return await interaction.showModal({
      customId: "config/already-setup/channels",
      title: "Channel Limits Configuration",
      components: createModalFields({
        categoryId: {
          label: "Category ID",
          placeholder: "Category ID",
          style: TextInputStyle.Paragraph,
          required: true,
        },
        voiceChannelId: {
          label: "Voice Channel ID",
          placeholder: "Voice Channel ID",
          style: TextInputStyle.Paragraph,
          required: true,
        },
      }),
    });
  },
});
