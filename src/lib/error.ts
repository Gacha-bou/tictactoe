import { MessageFlags, RepliableInteraction } from 'discord.js';

const flags = MessageFlags.Ephemeral;

export const errorReply = async (interaction: RepliableInteraction, message: string) => {
  await interaction.followUp({
    content: message,
    flags,
  });
  return;
};
