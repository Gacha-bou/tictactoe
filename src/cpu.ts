import { Board } from './boards';

type Result = 'win' | 'lose' | 'draw' | null;
const embedData = new Map<Result, { title: string; description: string; color: number }>([
  ['win', { title: '🎉 勝利！', description: 'ヨヨヨ〜あなたの勝利だよ〜！', color: 0x00ff00 }],
  [
    'lose',
    { title: '🤖 敗北！', description: 'イェーイ！感謝・感激・雨アラモード🍮！', color: 0xff0000 },
  ],
  [
    'draw',
    { title: '🤝 引き分け！', description: '引き分け！もう一戦しよっか！', color: 0xffff00 },
  ],
]);

const randomSelect = (board: Board) => {
  const nullIndexes = board.flatMap((v, i) => (v == null ? [i] : []));
  return nullIndexes[Math.floor(Math.random() * nullIndexes.length)];
};

export const selectCpuHand = (board: Board) => {
  // 難易度別に選んでほしい
  return randomSelect(board);
};
