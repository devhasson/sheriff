import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const channelUnlockedEmbed = createEmbed({
  title: "Channel Unlocked",
  description: "This voice channel is now open to everyone",
  color: Colors.DarkButNotBlack,
});
