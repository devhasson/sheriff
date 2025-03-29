import { createEmbed } from "@magicyan/discord";
import { Colors, User } from "discord.js";

export function createStandardEmbed({
  title,
  description,
  color = Colors.Blue,
  thumbnail,
  timestamp = false,
}: {
  title: string;
  description: string;
  color?: number;
  thumbnail?: string;
  timestamp?: boolean;
}) {
  return createEmbed({
    title,
    description,
    color,
    thumbnail: thumbnail ? { url: thumbnail } : undefined,
    timestamp: timestamp ? new Date() : undefined,
  });
}

export function createUserActionEmbed({
  user,
  action,
  actionTitle,
  color,
}: {
  user: User;
  action: string;
  actionTitle: string;
  color: number;
}) {
  return createStandardEmbed({
    title: actionTitle,
    description: `**@${user.displayName}** ${action}`,
    color,
    thumbnail: user.displayAvatarURL({ extension: "png" }) || "",
  });
}
