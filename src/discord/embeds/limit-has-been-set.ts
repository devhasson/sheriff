import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const limitHasBeenSetEmbed = (limit: number) =>
  createStandardEmbed({
    title: "User Limit Updated",
    description: `The voice channel user limit has been set to **${limit}**`,
    color: Colors.DarkButNotBlack,
  });
