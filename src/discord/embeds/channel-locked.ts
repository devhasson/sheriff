import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const channelLockedEmbed = createEmbed({
  title: "Channel Locked",
  description: "This voice channel has been locked to new participants",
  color: Colors.DarkButNotBlack,
});
