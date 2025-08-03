import { createEvent } from "#base";
import { prisma } from "#database";
import { ChannelType } from "discord.js";

createEvent({
  name: "onEmptyRoom",
  event: "voiceStateUpdate",
  async run(oldState, _newState) {
    const { channel, guild, member } = oldState;

    const guildConfig = await prisma.guildConfig.findUnique({
      where: {
        guildId: guild.id,
      },
    });

    if (!guildConfig) return;
    if (!channel || !guild || !member) return;
    if (channel.type !== ChannelType.GuildVoice) return;
    if (channel.members.size > 0) return;

    const isTemporaryRoom = channel.name.includes(
      `${member.user.username}'s - ${guildConfig.temporaryChannelComplement}`
    );

    if (!isTemporaryRoom) return;

    await channel.delete();
  },
});
