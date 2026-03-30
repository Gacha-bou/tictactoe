import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';

import { optionSelect } from './components/buttons';

// 送信者専用にする時にこれ
const flags = MessageFlags.Ephemeral;
type Status = 'wait' | 'play' | 'finish';

export class TicTocToe {
  private playUser = '';
  private gameStatus: Status = 'wait';

  public async startTicTacToe(interaction: ChatInputCommandInteraction) {
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
  public async stopTicTacToe(interaction: ChatInputCommandInteraction) {
    this.playUser = '';
    this.gameStatus = 'play';
    await interaction.reply({ content: '👋', flags });
  }
}
