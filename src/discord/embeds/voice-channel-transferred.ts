import { Colors, User } from "discord.js";
import { createUserActionEmbed } from "#functions";

export const voiceChannelTransferredEmbed = (user: User) =>
  createUserActionEmbed({
    user,
    actionTitle: "Channel Ownership Transferred",
    action: "is now the new owner of this voice channel",
    color: Colors.DarkButNotBlack,
  });
