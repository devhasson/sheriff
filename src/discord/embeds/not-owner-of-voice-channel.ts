import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const notOwnerOfVoiceChannelEmbed = createEmbed({
  title: "Permission Denied",
  description:
    "Only the channel owner can perform this action. Try asking the owner for assistance.",
  color: Colors.DarkButNotBlack,
});
