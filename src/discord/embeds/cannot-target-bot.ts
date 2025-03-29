import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const cannotTargetBotEmbed = createEmbed({
  title: "❌ Invalid Target",
  description: "You cannot perform this action on a bot.",
  color: Colors.NotQuiteBlack,
});
