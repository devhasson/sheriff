import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const userNotFoundEmbed = createStandardEmbed({
  title: "❓ User Not Found",
  description:
    "This user could not be found in the server. Make sure they are a member of this guild.",
  color: Colors.Grey,
});
