import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  MessageFlags,
} from 'discord.js';
import { gameConfig, TicTacToe } from '../tictactoe';
import { Board, Cell, placeCell } from '../boards';

import { makeSelectMenu } from './selectMenu';

const flags = MessageFlags.Ephemeral;

const button = {
  gameStart: {
    component: (turn: string | null, difficulty: string | null) =>
      new ButtonBuilder()
        .setCustomId('gamestart')
        .setLabel('ゲーム開始！')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!(turn && difficulty)),
    execute: async (tictactoe: TicTacToe, interaction: ButtonInteraction) => {
      await tictactoe.startTicTacToe(interaction);
    },
  },

  cell: {
    component: (num: number, cell: Cell, disabled = false) =>
      new ButtonBuilder()
        .setCustomId(`cell_${num}`)
        .setLabel(cell!)
        .setStyle(
          cell === '×'
            ? ButtonStyle.Danger
            : cell === '⚪︎'
              ? ButtonStyle.Primary
              : ButtonStyle.Secondary,
        )
        .setDisabled(disabled),
    execute: async (tictactoe: TicTacToe, interaction: ButtonInteraction) => {
      await tictactoe.onCellPressed(interaction);
    },
  },
};

export const optionSelect = (turn: string | null = null, difficulty: string | null = null) => {
  const okButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    button.gameStart.component(turn, difficulty),
  );

  return [makeSelectMenu('turn'), makeSelectMenu('difficulty'), okButton];
};

export const buildBoardButtons = (board: Board, disabled = false) => {
  const rows = [];
  // モダンに書く場合はどうなるか気になる箇所
  for (let line = 0; line < 3; line++) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    for (let col = 0; col < 3; col++) {
      const num = col + line * 3;
      const cell = board[num];
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`cell_${num}`)
          .setLabel(cell == null ? '-' : cell)
          .setStyle(
            cell == '×'
              ? ButtonStyle.Danger
              : cell == '⚪︎'
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary,
          )
          .setDisabled(disabled),
      );
    }
    rows.push(row);
  }
  return rows;
};

type ButtonKey = keyof typeof button;
type ComponentArgs<T extends ButtonKey> = Parameters<(typeof button)[T]['component']>;
type ButtonArgs<T extends ButtonKey> = [T, ...ComponentArgs<T>];

export const makeButton = <T extends ButtonKey>(...args: ButtonArgs<T>) => {
  const [name, ...rest] = args;
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    (button[name].component as (...a: unknown[]) => ButtonBuilder)(...rest),
  );
};

export const buttonInteraction = async (interaction: ButtonInteraction, tictactoe: TicTacToe) => {
  if (!(interaction.id in button)) {
    await interaction.reply({ content: '知らないボタンだよ〜', flags });
  }
  // 回線が遅いのもあるが毎回deferUpdateはおかしいはず
  await interaction.deferUpdate();
  const key = interaction.id as ButtonKey;
  await button[key].execute(tictactoe, interaction);
};
