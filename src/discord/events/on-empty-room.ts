import { createEvent } from "#base";
import { prisma } from "#database";
import { ChannelType } from "discord.js";

createEvent({
  name: "onEmptyRoom",
  event: "voiceStateUpdate",
  async run(oldState, _newState) {
    const { channel, guild, member } = oldState;

    const guildOnDatabase = await prisma.guild.findUnique({
      where: {
        id: guild.id,
      },
    });

    if (!guildOnDatabase) return;
    if (!channel || !guild || !member) return;
    if (channel.type !== ChannelType.GuildVoice) return;
    if (channel.members.size > 0) return;

    const isTemporaryRoom = channel.name.includes(
      `${member.user.username}'s - ${guildOnDatabase.temporaryChannelComplement}`
    );

    if (!isTemporaryRoom) return;

    await channel.delete();
  },
});
