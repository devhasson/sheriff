import { Colors, User } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const voiceChannelTransferredEmbed = (user: User) =>
  createEmbed({
    title: "Channel Ownership Transferred",
    description: `@${user.displayName} is now the new owner of this voice channel`,
    thumbnail: user.displayAvatarURL({ extension: "png" }),
    color: Colors.DarkButNotBlack,
  });
