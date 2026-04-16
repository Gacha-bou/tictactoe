import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
  MessageFlags,
} from 'discord.js';
import { gameConfig, TicTacToe } from '../tictactoe';

const difficulties = [
  { label: 'かんたん(ランダム)', value: 'easy' },
  { label: 'ふつう(半分ランダム)', value: 'normal' },
  { label: 'おに(多分勝てない)', value: 'impossible' },
];

const turns = [
  { label: '先行', value: 'user' },
  { label: '後攻', value: 'bot' },
];
const flags = MessageFlags.Ephemeral;

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
      await tictactoe.updateSelectMenu(interaction);
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
      await tictactoe.updateSelectMenu(interaction);
    },
  },
};

export const selectMenu = () => [makeSelectMenu('turn'), makeSelectMenu('difficulty')];

// コマンド名称
type menuName = keyof typeof menu;
export const selectMenuInteraction = async (
  interaction: StringSelectMenuInteraction,
  tictactoe: TicTacToe,
) => {
  if (!(interaction.customId in menu)) {
    await interaction.reply({ content: '知らないメニューだよ〜', flags });
    return;
  }

  await interaction.deferUpdate();
  const menuName = interaction.customId as menuName;
  await menu[menuName].execute(tictactoe, interaction);
};

export const makeSelectMenu = (menuName: menuName) => {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    menu[menuName].components(gameConfig[menuName]),
  );
};
