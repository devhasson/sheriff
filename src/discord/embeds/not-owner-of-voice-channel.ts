import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const notOwnerOfVoiceChannelEmbed = createStandardEmbed({
  title: "Permission Denied",
  description:
    "Only the channel owner can perform this action. Try asking the owner for assistance.",
  color: Colors.DarkButNotBlack,
});
