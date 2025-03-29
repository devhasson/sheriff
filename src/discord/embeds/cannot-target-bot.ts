import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const cannotTargetBotEmbed = createStandardEmbed({
  title: "❌ Invalid Target",
  description: "You cannot perform this action on a bot.",
  color: Colors.NotQuiteBlack,
});
