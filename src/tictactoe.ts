import {
  ChatInputCommandInteraction,
  MessageFlags,
  ButtonInteraction,
  RepliableInteraction,
} from 'discord.js';

import { optionSelect, buildBoardButtons } from './components/buttons';

import { Cell, Board, placeCell, Result, checkResult } from './boards';

import { selectCpuHand } from './cpu';

// 送信者専用にする時にこれ
const flags = MessageFlags.Ephemeral;
type Status = 'wait' | 'play' | 'finish';
const resultContent = new Map<NonNullable<Result>, string> ([
  ['win', 'ヨヨヨ〜あなたの勝利だよ〜…'],
  ['draw', '引き分け！もう一戦しよっか！'],
  ['lose', 'イェーイ！感謝・感激・雨アラモード🍮！'],
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
    if (this.gameStatus == 'wait') {
      this.playUser = interaction.user.id;
      this.gameStatus = 'play';
    } else if (this.playUser == interaction.user.id) {
      // 同じユーザが叩いたら一旦リセット
    } else {
      await interaction.reply({
        content: '現在別のユーザが実行中なので、時間を置いてから参加してね〜',
        flags,
      });
      return;
    }
    await interaction.reply({
      content: '次の設定から選んでね〜',
      components: optionSelect(),
      flags,
    });
    return;
  }

  public async startTicTacToe(interaction: ButtonInteraction) {
    if (!gameConfig.difficulty || !gameConfig.turn) {
      await interaction.editReply({
        content: '選択肢を全て選んでからゲームを始めてね〜',
        components: optionSelect(),
      });
      return;
    }
    this.board.fill(null);

    if (gameConfig.turn == 'bot') {
      placeCell(this.board, selectCpuHand(this.board), '×');
    }

    await interaction.editReply({
      content: 'ゲームを始めるよ！ヤッチョと勝負だ！',
      components: buildBoardButtons(this.board),
    });
    return;
  }

  public async onCellPressed(interaction: ButtonInteraction) {
    const num = parseInt(interaction.customId.replace('cell_', ''));

    if (num < 0 || 9 < num) {
      await interaction.followUp({
        content: 'そこに石はないよ！',
        flags,
      });
      return;
    }

    if (this.board[num] != null) {
      await interaction.followUp({
        content: 'もう既に置いているぅ！',
        flags,
      });
      return;
    }

    placeCell(this.board, num, '⚪︎');
    this.result = checkResult(this.board)
    if(this.result){
      this.endTicTacToe(this.result, interaction);
    }
    
    placeCell(this.board, selectCpuHand(this.board), '×');
    this.result = checkResult(this.board)
    if(this.result){
      this.endTicTacToe(this.result, interaction);
    }

    await interaction.editReply({
      components: buildBoardButtons(this.board),
    });
  }

  private async endTicTacToe(result: Result, interaction: ButtonInteraction){
    await interaction.followUp ({
      content: resultContent.get(result!) ?? '何これ？',
    });
    await this.stopTicTacToe();
    }

  public async stopTicTacToe() {
    this.playUser = '';
    this.gameStatus = 'wait';
    return;
  }
}
