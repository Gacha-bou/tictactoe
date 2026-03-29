import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';

import { TicTocToe } from '../tictactoe';
const flags = MessageFlags.Ephemeral;

// 将来的にtictactoe側で複数管理できるようにする
const tictactoe = new TicTocToe;

// 起動と終了の2つだけで現状十分
const commands = {
    tictoctoe : {
        data: new SlashCommandBuilder().setName('tictoctoe').setDescription('⚪︎×ゲームを開始します。'),
        execute: async (interaction: ChatInputCommandInteraction) => {
            await tictactoe.startTicTacToe(interaction);
        }
    },     
    stop : {
        data: new SlashCommandBuilder().setName('stop').setDescription('⚪︎×ゲームを終了します。'),
        execute: async (interaction: ChatInputCommandInteraction) => {
            await tictactoe.stopTicTacToe(interaction);
        }
    }, 
}; 

// 無関係のコマンドを弾けるように上記のコマンドの名称のみを抽出
type CommandName = keyof typeof commands;

// 上記コマンドをjsonにして登録可能な型にする
export const commandsData = Object.values(commands).map(command => command.data.toJSON());

// スラッシュコマンドが呼ばれて際に対応したハンドラを呼ぶ
export const slashCommandsInteraction = async (interaction: ChatInputCommandInteraction) => {
    if(!(interaction.commandName in commands )) {
        await interaction.reply({ content: 'やっちょの知らない言語だよ', flags });
        return;
    }
  const commandName = interaction.commandName as CommandName;
  await commands[commandName].execute(interaction);

}