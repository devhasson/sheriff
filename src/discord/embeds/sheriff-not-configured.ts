import { createEmbed } from "@magicyan/discord";
import { Colors } from "discord.js";

export const sheriffNotConfiguredEmbed = createEmbed({
  title: "Sheriff is not configured for this server.",
  description:
    "Please configure Sheriff by clicking the button below. If you already have a setup, click the other button.",
  color: Colors.DarkButNotBlack,
});
