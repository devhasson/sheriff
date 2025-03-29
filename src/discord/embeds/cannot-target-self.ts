import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const cannotTargetSelfEmbed = createStandardEmbed({
  title: "❌ Invalid Target",
  description: "You cannot perform this action on yourself.",
  color: Colors.NotQuiteBlack,
});
