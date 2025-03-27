import { Colors, User } from "discord.js";
import { createUserActionEmbed } from "#functions";

export const userBannedEmbed = (user: User) =>
  createUserActionEmbed({
    user,
    actionTitle: "🚫 User Banned",
    action: "has been banned from the voice channel",
    color: Colors.Red,
  });
