import { Client, GatewayIntentBits, Events, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { TicTacToe } from './tictactoe';
import { commandsData, slashCommandsInteraction } from './components/slashCommands';
import { buttonInteraction, selectMenuInteraction } from './components/buttons';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(
    'ヤオヨロ〜。3億円貰えるけど一生「 き 」から始まる食べ物しか食べられなくなるボタンがあったら押す〜？',
  );
});

// 将来的にtictactoe側で複数管理できるようにする
const tictactoe = new TicTacToe();

// イベント登録用
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await slashCommandsInteraction(interaction, tictactoe);
  } else if (interaction.isButton()) {
    await buttonInteraction(interaction, tictactoe);

    // コンボボックス選択時処理。別ファイルに分けるか？
  } else if (interaction.isStringSelectMenu()) {
    await selectMenuInteraction(interaction);
  }
});

// コマンド登録用
const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const GUILD_ID = process.env.GUILD_ID ?? null;
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    if (GUILD_ID !== null) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commandsData,
      });
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commandsData,
      });
    }
  } catch (error) {
    console.error(error);
  }
})();

// 起動する
client.login(TOKEN);
