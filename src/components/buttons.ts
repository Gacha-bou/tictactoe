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
        .setCustomId('gameStart')
        .setLabel('ゲーム開始！')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!(turn && difficulty)),
    execute: async (tictactoe: TicTacToe, interaction: ButtonInteraction) => {
      await tictactoe.startTicTacToe(interaction);
    },
  },

  gameEnd: {
    component: () =>
      new ButtonBuilder()
        .setCustomId('gameEnd')
        .setLabel('おしまい！')
        .setStyle(ButtonStyle.Danger),
    execute: async (tictactoe: TicTacToe, interaction: ButtonInteraction) => {
      await tictactoe.stopTicTacToe(interaction);
    },
  },

  cell: {
    component: (num: number, cell: Cell, disabled = false) =>
      new ButtonBuilder()
        .setCustomId(`cell_${num}`)
        .setLabel(cell ?? '-')
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
  return [
    makeSelectMenu('turn'),
    makeSelectMenu('difficulty'),
    makeButton('gameStart', turn, difficulty),
  ];
};

export const buildBoardButtons = (board: Board, disabled = false) =>
  // Array.fromでreturnしてくれるのありがたい
  Array.from({ length: 3 }, (_, line) =>
    makeButtonRow(
      ...Array.from({ length: 3 }, (_, col): AnyButtonArgs => {
        const num = col + line * 3;
        return ['cell', num, board[num], disabled];
      }),
    ),
  );

type ButtonKey = keyof typeof button;
type ComponentArgs<T extends ButtonKey> = Parameters<(typeof button)[T]['component']>;
type ButtonArgs<T extends ButtonKey> = [T, ...ComponentArgs<T>];

// 上記型を利用することで、makeButtonから型を揃えてボタンを作成できる
export const makeButton = <T extends ButtonKey>(...args: ButtonArgs<T>) => {
  const [name, ...rest] = args;
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    (button[name].component as (...a: unknown[]) => ButtonBuilder)(...rest),
  );
};

type AnyButtonArgs = { [K in ButtonKey]: ButtonArgs<K> }[ButtonKey];
export const makeButtonRow = (...buttonArgsList: AnyButtonArgs[]) => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  for (const args of buttonArgsList) {
    const [name, ...rest] = args;
    row.addComponents((button[name].component as (...a: unknown[]) => ButtonBuilder)(...rest));
  }
  return row;
};

export const buttonInteraction = async (interaction: ButtonInteraction, tictactoe: TicTacToe) => {
  // ボタン数値args持たせる
  const [customId, ...args] = interaction.customId.split('_');

  if (!(customId in button)) {
    await interaction.reply({ content: '知らないボタンだよ〜', flags });
    return;
  }
  // 回線が遅いのもあるが毎回deferUpdateはおかしいはず
  await interaction.deferUpdate();
  const key = customId as ButtonKey;
  await button[key].execute(tictactoe, interaction);
};
