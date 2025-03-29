import { createResponder, ResponderType } from "#base";
import { prisma } from "#database";
import { logger } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { ButtonStyle, Colors } from "discord.js";
import { createConfigButton, getGuildThumbnail } from "#functions";

createResponder({
  customId: "config/already-setup",
  types: [ResponderType.Button],
  cache: "cached",
  async run(interaction) {
    const { guild } = interaction;

    try {
      const guildOnDatabase = await prisma.guild.update({
        where: { id: guild.id },
        data: {
          deletedAt: null,
        },
      });

      logger.success(`Guild ${guild.id} updated on database.`);

      if (!guildOnDatabase) {
        return await interaction.reply({
          content: "Something went wrong. Please, try again later.",
          ephemeral: true,
        });
      }

      const validateCategory = guild.channels.cache.find(
        (channel) => channel.name === guildOnDatabase.categoryName
      );

      const validateVoiceChannel = guild.channels.cache.find(
        (channel) => channel.name === guildOnDatabase.voiceChannelName
      );

      const checkIfGuildIsAlreadySetup =
        validateCategory && validateVoiceChannel;

      if (!checkIfGuildIsAlreadySetup) {
        return await interaction.update({
          components: [
            createRow(
              createConfigButton({
                step: "start",
                data: {
                  label: "You must complete the setup",
                  emoji: "⚙️",
                },
              })
            ),
          ],
        });
      }

      await interaction.update({
        embeds: [
          createEmbed({
            title: "✅ Setup Complete!",
            description: `**Your Sheriff Voice Manager is now ready to use!**
  
            Users can now create temporary voice channels by joining the voice channel that was just created.
            
            **Need Help?**
            Contact our support team at davihasson@gmail.com`,
            color: Colors.Green,
            thumbnail: getGuildThumbnail(guild),
          }),
        ],
      });

      return await interaction.followUp({
        components: [
          createRow(
            createConfigButton({
              step: "cleanup",
              data: {
                label: "Delete Setup Channel",
                emoji: "🗑️",
                style: ButtonStyle.Secondary,
              },
            })
          ),
        ],
      });
    } catch (error) {
      logger.error(error);
      return await interaction.reply({
        content: "Something went wrong. Please, try again later.",
        ephemeral: true,
      });
    }
  },
});
