import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const notVoiceChannelEmbed = createEmbed({
  title: "Voice Channel Required",
  description:
    "This command can only be used inside voice channels. Please join one first.",
  color: Colors.DarkButNotBlack,
});
