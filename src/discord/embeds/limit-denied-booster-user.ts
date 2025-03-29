import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const limitDeniedBoosterUserEmbed = (limit: number) =>
  createEmbed({
    title: `⭐ ${limit} Users Limit Reached`,
    description: `You can't set the limit above ${limit} users.`,
    color: Colors.DarkButNotBlack,
  });
