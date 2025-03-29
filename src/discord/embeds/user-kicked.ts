import { Colors, User } from "discord.js";
import { createUserActionEmbed } from "#functions";

export const userKickedEmbed = (user: User) =>
  createUserActionEmbed({
    user,
    actionTitle: "User Kicked",
    action: "has been kicked from the voice channel",
    color: Colors.DarkButNotBlack,
  });
