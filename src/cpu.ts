import { Board } from './boards';

const randomSelect = (board: Board) => {
  const nullIndexes = board.flatMap((v, i) => (v == null ? [i] : []));
  return nullIndexes[Math.floor(Math.random() * nullIndexes.length)];
};

export const selectCpuHand = (board: Board) => {
  // 難易度別に選んでほしい
  return randomSelect(board);
};
