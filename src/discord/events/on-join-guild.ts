import { createEvent } from "#base";
import { prisma } from "#database";
import { createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";

createEvent({
  name: "onJoinGuild",
  event: "guildCreate",
  async run(guild) {
    const guildOnDatabase = await prisma.guild.findUnique({
      where: {
        id: guild.id,
      },
    });

    const isDeletedGuild = guildOnDatabase?.deletedAt !== null;

    if (!guildOnDatabase || isDeletedGuild) {
      const onboardingChannel = await guild.channels.create({
        name: "sheriff-onboarding",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            id: guild.ownerId,
          },
          {
            deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            id: guild.roles.everyone.id,
          },
        ],
      });

      return await onboardingChannel.send({
        embeds: [
          createEmbed({
            title: "🤠 Welcome to Sheriff Voice Manager!",
            description: `**Create and manage temporary voice channels with ease**\n
              **How it works:**
              Users can create temporary voice channels, and channel owners can manage them without needing special roles.\n
              **Setup Guide:**\n
              1. Users join a dedicated voice channel you'll configure\n
              2. They automatically get their own temporary voice channel\n
              3. As channel owner, they can customize settings and manage users\n\n
              Click the button below to complete the setup for your server.`,
            thumbnail: {
              url: guild.iconURL({ extension: "png" }) || "",
              name: guild.name,
            },
          }),
        ],
        components: [
          createRow(
            new ButtonBuilder({
              customId: "config/start",
              label: "Configure Sheriff",
              emoji: "⚙️",
              style: ButtonStyle.Primary,
            }),
            new ButtonBuilder({
              customId: "config/already-setup",
              label: "I already have a setup",
              emoji: "🤝",
              style: ButtonStyle.Secondary,
            })
          ),
        ],
      });
    }

    const category = await guild?.channels.create({
      name: guildOnDatabase.categoryName,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
      ],
    });

    return await guild.channels.create({
      name: guildOnDatabase.voiceChannelName,
      type: ChannelType.GuildVoice,
      parent: category,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ["ViewChannel", "Connect"],
          deny: ["Speak", "SendMessages", "ReadMessageHistory"],
        },
      ],
    });
  },
});
