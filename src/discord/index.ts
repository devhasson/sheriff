import { setupCreators } from "#base";
import { prisma } from "#database";

export const { createCommand, createEvent, createResponder } = setupCreators({
  commands: {
    guilds: (
      await prisma.guild.findMany({
        where: {
          allowedGuild: {
            not: null,
          },
        },
      })
    ).map((guild) => guild.id),
  },
  responders: {
    async middleware(interaction, _params, block) {
      if (
        interaction.guildId &&
        !(await prisma.guild.findUnique({ where: { id: interaction.guildId } }))
      ) {
        await interaction.reply({
          content: "This bot is not allowed to be used in this server.",
          ephemeral: true,
        });

        return block();
      }
    },
  },
});
