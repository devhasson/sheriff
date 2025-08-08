import { Colors, User } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const userUnmutedEmbed = (user: User) =>
  createEmbed({
    title: "User Unmuted",
    description: `${user.displayName} has been unmuted in the voice channel`,
    thumbnail: {
      url: user.displayAvatarURL({ extension: "png" }),
      name: user.displayName,
    },
    color: Colors.DarkButNotBlack,
  });
