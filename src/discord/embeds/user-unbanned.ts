import { Colors, User } from "discord.js";
import { createUserActionEmbed } from "#functions";

export const userUnbannedEmbed = (user: User) =>
  createUserActionEmbed({
    user,
    actionTitle: "✅ User Unbanned",
    action: "has been unbanned from the voice channel",
    color: Colors.Green,
  });
