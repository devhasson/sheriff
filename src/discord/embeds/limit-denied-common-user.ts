import { Colors } from "discord.js";
import { createEmbed } from "@magicyan/discord";

export const limitDeniedCommonUserEmbed = createEmbed({
  title: "⭐ Premium Limit Required",
  description:
    "You can't set the limit above 5 users. To set a higher limit, you need to be a **Nitro Booster** 🌟",
  color: Colors.Purple,
});
