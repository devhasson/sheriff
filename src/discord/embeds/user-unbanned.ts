import { Colors, User } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const userUnbannedEmbed = (user: User) =>
  createEmbed({
    title: "User Unbanned",
    description: `${user.displayName} has been unbanned from the voice channel`,
    thumbnail: user.displayAvatarURL({ extension: "png" }),
    color: Colors.DarkButNotBlack,
  });
