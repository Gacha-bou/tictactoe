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
import { Board } from '../boards';

export const optionSelect = () => {
  const turnMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('turn')
      .setPlaceholder('先行・後攻は？')
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('先行').setValue('user'),
        new StringSelectMenuOptionBuilder().setLabel('後攻').setValue('bot'),
      ),
  );

  const difficultyMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('difficulty')
      .setPlaceholder('難易度は？')
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('かんたん(ランダム)').setValue('easy'),
        new StringSelectMenuOptionBuilder().setLabel('ふつう(半分ランダム)').setValue('normal'),
        new StringSelectMenuOptionBuilder().setLabel('おに(多分勝てない)').setValue('impossible'),
      ),
  );

  const okButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('gamestart')
      .setLabel('ゲーム開始！')
      .setStyle(ButtonStyle.Primary),
  );

  return [turnMenu, difficultyMenu, okButton];
};

export const buildBoardButtons = (board: Board) => {
  const rows = [];
  // モダンに書く場合はどうなるか気になる箇所
  for (let line = 0; line < 3; line++) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    for (let col = 0; col < 3; col++) {
      const num = col + line * 3 + 1;
      row.addComponents(new ButtonBuilder().setCustomId(`${num}`).setLabel(`${num}`).setStyle(ButtonStyle.Primary));
    }
    rows.push(row);
  }
  return(rows);
};

// ここら辺の処理をslashCommandsと同じ感じにできるはずだけど一旦後回し
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
};

export const buttonInteraction = async (interaction: ButtonInteraction, tictactoe: TicTacToe) => {
  // 回線が遅いのもあるが毎回deferUpdateはおかしいはず
  await interaction.deferUpdate();

  switch (interaction.customId) {
    case 'gamestart':
      await tictactoe.startTicTacToe(interaction, tictactoe);
      break;
  }
};
