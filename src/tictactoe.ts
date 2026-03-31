import {
  ChatInputCommandInteraction,
  MessageFlags,
  ButtonInteraction,
  RepliableInteraction,
} from 'discord.js';

import { optionSelect } from './components/buttons';

// 送信者専用にする時にこれ
const flags = MessageFlags.Ephemeral;
type Status = 'wait' | 'play' | 'finish';

export const gameConfig = new Map<
  string,
  {
    turn?: string;
    difficulty?: string;
  }
>();

export class TicTacToe {
  private playUser = '';
  private gameStatus: Status = 'wait';

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
    await interaction.editReply({
      content: '今から実装するので待っててね〜ヨヨヨ〜',
      components: [],
    });
    await tictactoe.stopTicTacToe(interaction);

    return;
  }

  public async stopTicTacToe(interaction: RepliableInteraction) {
    this.playUser = '';
    this.gameStatus = 'wait';
    return;
  }
}
