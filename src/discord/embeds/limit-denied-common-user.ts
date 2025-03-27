import { Colors } from "discord.js";
import { createStandardEmbed } from "#functions";

export const limitDeniedCommonUserEmbed = createStandardEmbed({
  title: "⭐ Premium Limit Required",
  description:
    "You can't set the limit above 5 users. To set a higher limit, you need to be a **Nitro Booster** 🔥",
  color: Colors.Purple,
  footer: {
    text: "Sheriff Voice Manager",
  },
  timestamp: new Date(),
});
