import { Colors, User } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const userMutedEmbed = (user: User) =>
  createEmbed({
    title: "User Muted",
    description: `${user.displayName} has been muted in the voice channel`,
    thumbnail: {
      url: user.displayAvatarURL({ extension: "png" }),
      name: user.displayName,
    },
    color: Colors.DarkButNotBlack,
  });
