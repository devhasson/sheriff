import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const userNotFoundEmbed = createEmbed({
  title: "User Not Found",
  description:
    "This user could not be found in the server. Make sure they are a member of this guild.",
  color: Colors.NotQuiteBlack,
});
