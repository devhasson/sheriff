import { createEvent } from "#base";
import { prisma } from "#database";
import { logger } from "#settings";

createEvent({
  name: "onLeftGuild",
  event: "guildDelete",
  async run(guild) {
    const guildOnDatabase = await prisma.guild.findUnique({
      where: { id: guild.id },
    });

    if (!guildOnDatabase) return;

    await prisma.guild.update({
      where: { id: guild.id },
      data: { deletedAt: new Date() },
    });

    logger.log(`Guild ${guild.name} - (${guild.id}) deleted.`);
  },
});
