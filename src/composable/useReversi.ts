import { computed, ref, watch } from "vue";

type BW = "b" | "w";
type CellPiece = BW | null;
type CellState = {
  placed: CellPiece;
  candidate: boolean;
};

const initBoard = (w: number, h: number): CellState[] => {
  return new Array(Math.max(1, h) * Math.max(1, w)).fill({
    placed: null,
    candidate: false,
  });
};

const dirs = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

export const useReversi = (options?: { w?: number; h?: number }) => {
  const col = ref(options?.w || 8);
  const row = ref(options?.h || 8);
  const currentMove = ref<BW>("b");
  const currentTurn = ref(0);
  const board = ref(initBoard(col.value, row.value));

  const isOutOfRange = (x: number, y: number) => {
    return x < 0 || x >= col.value || y < 0 || y >= row.value;
  };
  const getCellIndex = (x: number, y: number) => x + y * col.value;

  const getCell = (x: number, y: number) => {
    if (isOutOfRange(x, y)) return null;
    return board.value[getCellIndex(x, y)];
  };

  const _setCell = (x: number, y: number, piece: BW) => {
    if (isOutOfRange(x, y)) return null;
    board.value[getCellIndex(x, y)] = { placed: piece, candidate: false };
  };

  const turnNext = (skip = false) => {
    if (skip) {
      skipped.value++;
    } else {
      skipped.value = 0;
    }
    if (score.value.rest === 0) return;
    const nextPiece = currentMove.value === "b" ? "w" : "b";
    currentMove.value = nextPiece;
    currentTurn.value++;

    updateCandidate(nextPiece);
  };

  const setCell = (x: number, y: number) => {
    const piece = currentMove.value;
    _setCell(x, y, piece);

    reversePieces(x, y, piece);

    turnNext();
  };

  const reversePieces = (x: number, y: number, piece: BW) => {
    dirs.forEach(([dx, dy]) => {
      if (!check(x, y, dx, dy, piece)) return;

      let cellX = x;
      let cellY = y;
      while (true) {
        cellX += dx;
        cellY += dy;
        const c = getCell(cellX, cellY);
        if (c == null || c.placed == null || c.placed === piece) return;

        c.placed = piece;
      }
    });
  };

  const check = (x: number, y: number, dx: number, dy: number, piece: BW) => {
    let cellX = x;
    let cellY = y;
    let hasReversed = false;
    while (true) {
      cellX += dx;
      cellY += dy;
      const c = getCell(cellX, cellY);

      if (c == null || c.placed == null) return false;

      const isReversedPiece = c.placed !== piece;
      if (isReversedPiece) {
        hasReversed = true;
        continue;
      }
      if (!hasReversed) return false;

      return true;
    }
  };
  const updateCandidate = (nextPiece: BW) => {
    boardRowList.value.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.placed) return;

        const isCandidate = dirs.some(([dx, dy]) => {
          return check(x, y, dx, dy, nextPiece);
        });

        const currentCell = board.value[getCellIndex(x, y)];
        if (isCandidate) {
          board.value[getCellIndex(x, y)] = {
            placed: null,
            candidate: true,
          };
        } else {
          board.value[getCellIndex(x, y)] = {
            ...currentCell,
            candidate: false,
          };
        }
      });
    });
  };

  const init = () => {
    skipped.value = 0;
    board.value = initBoard(col.value, row.value);

    const halfW = Math.ceil(col.value / 2) - 1;
    const halfH = Math.ceil(row.value / 2) - 1;

    _setCell(halfW, halfH, "b");
    _setCell(halfW + 1, halfH, "w");
    _setCell(halfW, halfH + 1, "w");
    _setCell(halfW + 1, halfH + 1, "b");
    updateCandidate("b");
    currentTurn.value = 0;
  };

  const isFinished = computed(() => {
    const { b, w, rest } = score.value;
    return [b, w, rest].some((val) => val === 0) || skipped.value >= 2;
  });

  const skipped = ref(0);
  const autoPlace = () => {
    if (isFinished.value) return false;
    const candidateList: { x: number; y: number }[] = [];
    boardRowList.value.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.candidate) {
          candidateList.push({ x, y });
        }
      });
    });
    if (candidateList.length === 0) {
      turnNext(true);
      return true;
    }
    const cell =
      candidateList[Math.floor(Math.random() * candidateList.length)];
    setCell(cell.x, cell.y);
    return true;
  };

  const boardRowList = computed(() => {
    return Array.from(Array(row.value)).map((_, i) =>
      board.value.slice(i * col.value, (i + 1) * col.value)
    );
  });

  const score = computed(() => {
    let pt = {
      b: 0,
      w: 0,
      rest: 0,
      candidate: 0,
    };

    board.value.forEach((cell) => {
      pt[cell.placed || "rest"]++;
      if (cell.candidate) pt.candidate++;
    });
    return pt;
  });

  watch([col, row], init);

  return {
    col,
    row,
    boardRowList,
    currentMove,
    currentTurn,
    score,
    turnNext,
    getCell,
    setCell,
    init,
    autoPlace,
  };
};
