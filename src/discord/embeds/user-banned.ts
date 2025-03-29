import { Colors, User } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const userBannedEmbed = (user: User) =>
  createEmbed({
    title: "User Banned",
    description: `${user.displayName} has been banned from the voice channel`,
    thumbnail: user.displayAvatarURL({ extension: "png" }),
    color: Colors.DarkButNotBlack,
  });
