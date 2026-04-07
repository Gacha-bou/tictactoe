import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuInteraction,
  ButtonInteraction,
  Application,
} from 'discord.js';
import { gameConfig, TicTacToe } from '../tictactoe';
import { Board, placeCell } from '../boards';

export const optionSelect = (turn: string | null = null, difficulty: string | null = null) => {
  const turnMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('turn')
      .setPlaceholder('先行・後攻は？')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('先行')
          .setValue('user')
          .setDefault(turn === 'user'),
        new StringSelectMenuOptionBuilder()
          .setLabel('後攻')
          .setValue('bot')
          .setDefault(turn === 'bot'),
      ),
  );

  const difficultyMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('difficulty')
      .setPlaceholder('難易度は？')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('かんたん(ランダム)')
          .setValue('easy')
          .setDefault(difficulty === 'easy'),
        new StringSelectMenuOptionBuilder()
          .setLabel('ふつう(半分ランダム)')
          .setValue('normal')
          .setDefault(difficulty === 'normal'),
        new StringSelectMenuOptionBuilder()
          .setLabel('おに(多分勝てない)')
          .setValue('impossible')
          .setDefault(difficulty === 'impossible'),
      ),
  );

  const okButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('gamestart')
      .setLabel('ゲーム開始！')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!(turn && difficulty)),
  );

  return [turnMenu, difficultyMenu, okButton];
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

export const buttonInteraction = async (interaction: ButtonInteraction, tictactoe: TicTacToe) => {
  // 回線が遅いのもあるが毎回deferUpdateはおかしいはず
  await interaction.deferUpdate();

  switch (interaction.customId) {
    case 'gamestart':
      await tictactoe.startTicTacToe(interaction);
      break;

    // ボード内のボタンが押された際の処理
    default:
      if (interaction.customId.startsWith('cell_')) {
        await tictactoe.onCellPressed(interaction);
      }
      break;
  }
};
