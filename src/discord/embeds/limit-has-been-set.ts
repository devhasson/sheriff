import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const limitHasBeenSetEmbed = (limit: number) =>
  createEmbed({
    title: "User Limit Updated",
    description: `The voice channel user limit has been set to **${limit}**`,
    color: Colors.DarkButNotBlack,
  });
