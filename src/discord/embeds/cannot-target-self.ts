import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const cannotTargetSelfEmbed = createEmbed({
  title: "❌ Invalid Target",
  description: "You cannot perform this action on yourself.",
  color: Colors.NotQuiteBlack,
});
