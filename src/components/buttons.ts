import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';

export function optionSelect() {
  const turnMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('turn')
      .setPlaceholder('先行・後攻は？')
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('先行').setValue('go_first'),
        new StringSelectMenuOptionBuilder().setLabel('後攻').setValue('go_second'),
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

  return [turnMenu, difficultyMenu];
}
