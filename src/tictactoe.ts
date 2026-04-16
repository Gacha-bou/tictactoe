import {
  ChatInputCommandInteraction,
  MessageFlags,
  ButtonInteraction,
  EmbedBuilder,
  RepliableInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';

import { buildBoardButtons, makeButton, makeButtonRow } from './components/buttons';

import { Cell, Board, placeCell, Result, checkResult } from './boards';

import { selectCpuHand } from './cpu';

import { errorReply } from './lib/error';
import { selectMenu } from './components/selectMenu';

// 送信者専用にする時にこれ
const flags = MessageFlags.Ephemeral;
type Status = 'wait' | 'play' | 'finish';
const resultContent = new Map<
  NonNullable<Result>,
  { title: string; description: string; color: number }
>([
  ['win', { title: '勝利‼️', description: 'ヨヨヨ〜あなたの勝利だよ〜！', color: 0x0075ca }],
  ['draw', { title: '引き分け❗️', description: '引き分け！もう一戦しよっか！', color: 0x2ea44f }],
  [
    'lose',
    { title: '敗北❗️', description: 'イェーイ！感謝・感激・雨アラモード🍮！', color: 0xd73a4a },
  ],
]);

// 将来的にmap型にしてユーザ別にセッションを保持できるようにする
export const gameConfig: {
  turn: string | null;
  difficulty: string | null;
} = {
  turn: null,
  difficulty: null,
};

export class TicTacToe {
  private playUser: String = '';
  private gameStatus: Status = 'wait';
  private board: Board = Array(9).fill(null);
  private result: Result = null;

  public async initTicTacToe(interaction: ChatInputCommandInteraction) {
    if (this.gameStatus === 'wait') {
      this.playUser = interaction.user.id;
      this.gameStatus = 'play';
    } else if (this.playUser === interaction.user.id) {
      // 同じユーザが叩いたら一旦リセット
    } else {
      await errorReply(interaction, '現在別のユーザが実行中なので、時間を置いてから参加してね〜');
      return;
    }
    await interaction.reply({
      content: '次の設定から選んでね〜',
      components: [...selectMenu(), makeButtonRow(['gameStart', 'turn', 'difficulty'])],
      flags,
    });
    return;
  }

  public async updateSelectMenu(interaction: RepliableInteraction) {
    const isRestarting = this.gameStatus === 'wait';
    await interaction.editReply({
      components: [
        ...selectMenu(),
        isRestarting
          ? makeButtonRow(['gameStart', 'turn', 'difficulty'], ['gameEnd'])
          : makeButtonRow(['gameStart', 'turn', 'difficulty']),
      ],
    });
  }

  public async startTicTacToe(interaction: ButtonInteraction) {
    if (!gameConfig.difficulty || !gameConfig.turn) {
      await errorReply(interaction, '選択肢を全て選んでからゲームを始めてね〜');
      return;
    }
    this.board.fill(null);

    if (gameConfig.turn == 'bot') {
      placeCell(this.board, selectCpuHand(this.board), '×');
    }

    // 設定画面を消す
    await interaction.deleteReply();

    await interaction.followUp({
      content: 'ゲームを始めるよ！ヤッチョと勝負だ！',
      components: buildBoardButtons(this.board),
    });
    return;
  }

  public async onCellPressed(interaction: ButtonInteraction) {
    const num = parseInt(interaction.customId.replace('cell_', ''));
    if (num < 0 || 9 < num) {
      await errorReply(interaction, 'そこに石はないよ！');
    }

    if (this.board[num] != null) {
      await errorReply(interaction, 'もう既に置いているぅ！');
      return;
    }

    // 人
    placeCell(this.board, num, '⚪︎');
    this.result = checkResult(this.board);
    if (this.result) {
      await this.endTicTacToe(this.result, interaction);
      await interaction.editReply({
        components: buildBoardButtons(this.board, true),
      });

      return;
    }

    // CPU
    placeCell(this.board, selectCpuHand(this.board), '×');
    this.result = checkResult(this.board);
    if (this.result) {
      await this.endTicTacToe(this.result, interaction);
      await interaction.editReply({
        components: buildBoardButtons(this.board, true),
      });

      return;
    }

    await interaction.editReply({
      components: buildBoardButtons(this.board),
    });
  }

  private async endTicTacToe(result: Result, interaction: ButtonInteraction) {
    const data = resultContent.get(result!);
    const embed = new EmbedBuilder()
      .setTitle(data?.title ?? '')
      .setDescription(data?.description ?? '')
      .setColor(data?.color ?? 0x000000);
    await interaction.followUp({
      embeds: [embed],
    });

    await interaction.followUp({
      content: 'もう一回やる〜？',
      components: [
        ...selectMenu(),
        makeButtonRow(['gameStart', 'turn', 'difficulty'], ['gameEnd']),
      ],
    });
    this.resetTicTacToe();
  }

  public async stopTicTacToe(interaction: RepliableInteraction) {
    await interaction.followUp({
      content: '一旦ここまで！さらば〜い！🐙',
      flags,
    });
  }

  private resetTicTacToe() {
    this.playUser = '';
    this.gameStatus = 'wait';
    return;
  }
}
