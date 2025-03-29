import {
  APIButtonComponent,
  ButtonBuilder,
  ButtonComponentData,
} from "discord.js";

export function createConfigButton({
  step,
  data,
}: {
  step: string;
  data: Partial<ButtonComponentData> | Partial<APIButtonComponent>;
}) {
  return new ButtonBuilder({
    customId: `config/${step}`,
    ...data,
  });
}
