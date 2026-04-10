import {
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { gameConfig, TicTacToe } from '../tictactoe';
import { optionSelect } from './buttons';

const difficulties = [
  { label: 'かんたん(ランダム)', value: 'easy' },
  { label: 'ふつう(半分ランダム)', value: 'normal' },
  { label: 'おに(多分勝てない)', value: 'impossible' },
];

const turns = [
  { label: '先行', value: 'user' },
  { label: '後攻', value: 'bot' },
];

const menu = {
  turn: {
    components: (turn: string | null = null) =>
      new StringSelectMenuBuilder()
        .setCustomId('turn')
        .setPlaceholder('先行・後攻は？')
        .addOptions(
          turns.map(({ label, value }) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(label)
              .setValue(value)
              .setDefault(value === turn),
          ),
        ),

    execute: async (tictactoe: TicTacToe, interaction: StringSelectMenuInteraction) => {
      gameConfig.turn = interaction.values[0];
      await interaction.editReply({
        components: optionSelect(gameConfig.turn, gameConfig.difficulty),
      });
    },
  },
  difficulty: {
    components: (difficulty: string | null = null) =>
      new StringSelectMenuBuilder()
        .setCustomId('difficulty')
        .setPlaceholder('難易度は？')
        .addOptions(
          difficulties.map(({ label, value }) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(label)
              .setValue(value)
              .setDefault(value === difficulty),
          ),
        ),

    execute: async (tictactoe: TicTacToe, interaction: StringSelectMenuInteraction) => {
      gameConfig.difficulty = interaction.values[0];
      await interaction.editReply({
        components: optionSelect(gameConfig.turn, gameConfig.difficulty),
      });
    },
  },
};

// コマンド名称
type menuName = keyof typeof menu;
export const selectMenu = Object.values(menu).map;

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
