import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const notVoiceChannelEmbed = createStandardEmbed({
  title: "🎤 Voice Channel Required",
  description:
    "This command can only be used inside voice channels. Please join one first.",
  color: Colors.Blue,
  footer: {
    text: "Sheriff Voice Manager",
  },
  timestamp: new Date(),
});
