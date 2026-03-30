import { StringSelectMenuInteraction } from 'discord.js';

export const selectMenuInteraction = async (interaction: StringSelectMenuInteraction) => {
  // 仮置き。コンボボックスが選ばれたら諸々変数を変える処理を書く
  await interaction.update({});
};
