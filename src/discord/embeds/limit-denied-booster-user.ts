import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const limitDeniedBoosterUserEmbed = (limit: number) =>
  createStandardEmbed({
    title: `⭐ ${limit} Users Limit Reached`,
    description: `You can't set the limit above ${limit} users.`,
    color: Colors.DarkButNotBlack,
  });
