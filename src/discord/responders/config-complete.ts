import { createResponder, ResponderType } from "#base";
import { prisma } from "#database";
import { logger } from "#settings";
import { createRow } from "@magicyan/discord";
import { ButtonStyle, Colors } from "discord.js";
import {
  createStandardButton,
  createStandardEmbed,
  getGuildThumbnail,
} from "#functions";

createResponder({
  customId: "config/setup/complete",
  types: [ResponderType.ModalComponent],
  cache: "cached",
  async run(interaction) {
    const { fields, guild } = interaction;

    const channelLimitForNormalUsers = fields.getTextInputValue(
      "channelLimitForNormalUsers"
    );
    const channelLimitForBoosters = fields.getTextInputValue(
      "channelLimitForBoosters"
    );

    try {
      await prisma.guild.update({
        where: { id: guild.id },
        data: {
          channelLimitForNormalUsers: Number(channelLimitForNormalUsers),
          channelLimitForBoosters: Number(channelLimitForBoosters),
        },
      });
      logger.success(`Finished configuration for guild ${guild.id}.`);
    } catch (error) {
      logger.error(error);
      return await interaction.reply({
        content:
          "An error occurred while finishing the configuration. Please, try again later.",
        ephemeral: true,
      });
    }

    return await interaction.update({
      embeds: [
        createStandardEmbed({
          title: "✅ Setup Complete!",
          description: `**Your Sheriff Voice Manager is now ready to use!**

          Users can now create temporary voice channels by joining the voice channel that was just created.
          
          **Need Help?**
          Contact our support team at davihasson@gmail.com`,
          color: Colors.Green,
          thumbnail: getGuildThumbnail(guild),
        }),
      ],
      components: [
        createRow(
          createStandardButton({
            id: "config/cleanup",
            label: "Delete Setup Channel",
            emoji: "🗑️",
            style: ButtonStyle.Secondary,
          })
        ),
      ],
    });
  },
});
