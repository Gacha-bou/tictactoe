export type Cell = 'X' | 'O' | null;

export type Board = Cell[];

export const placeCell = (board: Board, idx: number, mark: Cell) => {
  board[idx] = mark;
};

export const checkResult = (board: Board) => {};
