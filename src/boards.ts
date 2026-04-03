export type Cell = '×' | '⚪︎' | null;
export type Result = 'win' | 'lose' | 'draw' | null;

// 脳筋だけどClaudeくんに聞いたららコレが最適らしい
const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],] as const;


export type Board = Cell[];

export const placeCell = (board: Board, idx: number, mark: Cell) => {
  board[idx] = mark;
};

// Claudeくん引用
export const checkWinner = (board: Board): Result => {
    const winningLine = WINNING_LINES.find(([a, b, c]) =>
        board[a] !== null &&
        board[a] === board[b] &&
        board[a] === board[c]
    );

    if (winningLine) {
        const [a] = winningLine; // 最初のインデックスだけ取り出す
        return board[a] == '⚪︎' ? 'win' : 'lose';
    }
    return null;
};

const checkDraw = (board: Board): Result => {
  if(board.every(v => v !== null)) {
    return 'draw';
  }
  return null;
};

export const checkResult = (board: Board): Result => {
    const winner = checkWinner(board);
    if (winner) return winner;

    if (checkDraw(board)) return 'draw';
    return null;
};
