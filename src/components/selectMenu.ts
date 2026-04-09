import { StringSelectMenuInteraction } from 'discord.js';
import { gameConfig, TicTacToe } from '../tictactoe';
import { optionSelect } from './buttons';

export const selectMenuInteraction = async (interaction: StringSelectMenuInteraction) => {
  await interaction.deferUpdate();
  const selected = interaction.values[0]; // 選択した値を取得

  switch (interaction.customId) {
    case 'turn':
      gameConfig.turn = selected;
      break;
    case 'difficulty':
      gameConfig.difficulty = selected;
      break;
  }

  await interaction.editReply({
    components: optionSelect(gameConfig.turn, gameConfig.difficulty),
  });
};
