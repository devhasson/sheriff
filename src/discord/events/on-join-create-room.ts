import { createEvent } from "#base";
import { prisma } from "#database";
import { ChannelType } from "discord.js";

createEvent({
  name: "onJoinCreateRoom",
  event: "voiceStateUpdate",
  async run(_oldState, newState) {
    const { channel, guild, member } = newState;

    const guildOnDatabase = await prisma.guild.findUnique({
      where: {
        id: guild.id,
      },
    });

    if (!guildOnDatabase) return;
    if (!channel || !guild || !member) return;
    if (channel.name !== guildOnDatabase.voiceChannelName) return;

    const userIsBooster = Boolean(member.premiumSince);

    const openCodeChannel = await guild.channels.create({
      name: `${member.user.username}'s - ${guildOnDatabase.temporaryChannelComplement}`,
      type: ChannelType.GuildVoice,
      parent: channel.parent,
      userLimit: userIsBooster
        ? guildOnDatabase.channelLimitForBoosters
        : guildOnDatabase.channelLimitForNormalUsers,
    });

    await member.voice.setChannel(openCodeChannel);
  },
});
