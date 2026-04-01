import {
  ChatInputCommandInteraction,
  MessageFlags,
  ButtonInteraction,
  RepliableInteraction,
} from 'discord.js';

import { optionSelect, buildBoardButtons} from './components/buttons';

import { Cell, Board } from './boards';

// 送信者専用にする時にこれ
const flags = MessageFlags.Ephemeral;
type Status = 'wait' | 'play' | 'finish';

// 将来的にmap型にしてユーザ別にセッションを保持できるようにする
export const gameConfig: {
  turn: string | null;
  difficulty: string | null;
} = {
  turn: null,
  difficulty: null,
};

export class TicTacToe {
  private playUser = '';
  private gameStatus: Status = 'wait';
  private board: Board = Array(9).fill(null);

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

  public async startTicTacToe(interaction: ButtonInteraction, tictactoe: TicTacToe) {
    if (!gameConfig.difficulty || !gameConfig.turn) {
      await interaction.editReply({
        content: '選択肢を全て選んでからゲームを始めてね〜',
        components: optionSelect(),
      });
      return;
    }

    await interaction.editReply({
      content: 'ゲームを始めるよ！ヤッチョと勝負だ！',
      components: buildBoardButtons(this.board),
    });
    return;
  }

  public async stopTicTacToe(interaction: RepliableInteraction) {
    this.playUser = '';
    this.gameStatus = 'wait';
    return;
  }
}
