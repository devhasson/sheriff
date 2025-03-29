import { Guild } from "discord.js";

export function getGuildThumbnail(guild: Guild): string {
  return guild.iconURL({ extension: "png" }) || "";
}
