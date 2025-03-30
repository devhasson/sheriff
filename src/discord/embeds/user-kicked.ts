import { Colors, User } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const userKickedEmbed = (user: User) =>
  createEmbed({
    title: "User Kicked",
    description: `${user.displayName} has been kicked from the voice channel`,
    thumbnail: {
      url: user.displayAvatarURL({ extension: "png" }),
      name: user.displayName,
    },
    color: Colors.DarkButNotBlack,
  });
