import { Colors, User } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const userBannedEmbed = (user: User) =>
  createEmbed({
    title: "User Banned",
    description: `${user.displayName} has been banned from the voice channel`,
    thumbnail: {
      url: user.displayAvatarURL({ extension: "png" }),
      name: user.displayName,
    },
    color: Colors.DarkButNotBlack,
  });
