import { createEvent } from "#base";
import { prisma } from "#database";
import { ChannelType } from "discord.js";

createEvent({
  name: "onJoinCreateRoom",
  event: "voiceStateUpdate",
  async run(_oldState, newState) {
    const { channel, guild, member } = newState;

    const guildConfig = await prisma.guildConfig.findUnique({
      where: {
        guildId: guild.id,
      },
    });

    if (!guildConfig) return;
    if (!channel || !guild || !member) return;

    if (channel.name !== guildConfig.voiceChannelName) return;

    const userIsBooster = Boolean(member.premiumSince);

    const openCodeChannel = await guild.channels.create({
      name: `${member.user.username}'s - ${guildConfig.temporaryChannelComplement}`,
      type: ChannelType.GuildVoice,
      parent: channel.parent,
      userLimit: userIsBooster
        ? guildConfig.channelLimitForBoosters
        : guildConfig.channelLimitForNormalUsers,
    });

    await member.voice.setChannel(openCodeChannel);
  },
});
