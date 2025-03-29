import { ButtonBuilder, ButtonStyle } from "discord.js";

export function createStandardButton({
  id,
  label,
  emoji,
  style = ButtonStyle.Primary,
}: {
  id: string;
  label: string;
  emoji?: string;
  style?:
    | ButtonStyle.Primary
    | ButtonStyle.Secondary
    | ButtonStyle.Success
    | ButtonStyle.Danger
    | ButtonStyle.Premium
    | undefined;
}) {
  return new ButtonBuilder({
    customId: id,
    label,
    emoji,
    style: style,
  });
}

export function createConfigButton({
  step,
  label,
  emoji,
  style = ButtonStyle.Primary,
}: {
  step: string;
  label: string;
  emoji?: string;
  style?:
    | ButtonStyle.Primary
    | ButtonStyle.Secondary
    | ButtonStyle.Success
    | ButtonStyle.Danger
    | ButtonStyle.Premium
    | undefined;
}) {
  return createStandardButton({
    id: `config/${step}`,
    label,
    emoji,
    style,
  });
}
