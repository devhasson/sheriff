import { createResponder, ResponderType } from "#base";
import { createModalFields } from "@magicyan/discord";
import { TextInputStyle } from "discord.js";

createResponder({
  customId: "config/limits",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction) {
    return await interaction.showModal({
      customId: "config/complete",
      title: "Channel Limits Configuration",
      components: createModalFields({
        channelLimitForNormalUsers: {
          label: "Standard User Limit",
          value: "5",
          placeholder: "Maximum number of channels (recommended: 5)",
          style: TextInputStyle.Short,
          required: true,
        },
        channelLimitForBoosters: {
          label: "Nitro Booster Limit",
          value: "15",
          placeholder: "Maximum number of channels (recommended: 15)",
          style: TextInputStyle.Short,
          required: true,
        },
      }),
    });
  },
});
