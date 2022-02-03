/**
 * makes a puzzle
 * @returns {Array}
 */
export const makePuzzle = () => {
  let isPuzzle = false;
  while (!isPuzzle) {
    const puzzle: number[][] = [];
    const rows = Array.from(Array(9).fill([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    const cols = Array.from(Array(9).fill([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    const squares = Array.from(Array(9).fill([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    let count = 0;
    for (let i = 0; i < 9; i += 1) {
      const p: number[] = [];
      for (let j = 0; j < 9; j += 1) {
        const sqIdx = (Math.floor(i / 3) * 3 + Math.floor(j / 3));
        const choices = [...rows[i]]
          .filter((x) => cols[j].includes(x)).filter((x) => squares[sqIdx].includes(x));
        const choice = choices[Math.floor(Math.random() * choices.length)];
        if (!choice) {
          // we hit a dead end
          // eslint-disable-next-line no-continue
          continue;
        }
        p.push(choice);
        rows[i] = rows[i].filter((x: number) => x !== choice);
        cols[j] = cols[j].filter((x: number) => x !== choice);
        squares[sqIdx] = squares[sqIdx].filter((x: number) => x !== choice);
        count += 1;
      }
      puzzle.push(p);
    }
    if (count === 81) isPuzzle = true;
    if (isPuzzle) return puzzle;
  }
  return null;
};

/**
 * checks if the cell at (i,j) can contain the number we are trying to pluck
 * @param puzzle
 * @param i
 * @param j
 * @param cell
 * @returns
 */
const canBe = (puzzle: number[][], i: number, j: number, cell: number) => {
  const x = Math.floor(cell / 9);
  const y = cell % 9;
  const val = puzzle[x][y];

  if (puzzle[i][j] === val) return true;

  for (let k = 0; k < 9; k += 1) {
    const row = { x: k, y: j };
    const col = { x: i, y: k };
    const square = {
      x: Math.floor(i / 3) * 3 + Math.floor(k / 3),
      y: Math.floor(j / 3) * 3 + (k % 3),
    };
    if (!(row.x === x && row.y === y) && puzzle[row.x][row.y] === val) return false;
    if (!(col.x === x && col.y === y) && puzzle[col.x][col.y] === val) return false;
    if (!(square.x === x && square.y === y) && puzzle[square.x][square.y] === val) return false;
  }

  return true;
};

/**
 * removes one cell at a time at random, while making sure puzzle can still be solved
 * @param puzzle
 * @param n
 * @returns {Array}
 */
export const pluck = (puzzle: number[][], n = 0) => {
  const cells: number[] = Array.from(Array(81).keys());
  const puzzleCopy = [...puzzle];
  let count = 0;
  while (cells.length > n && count < n) {
    let cell = -1;
    while (cell === -1) {
      cell = cells[Math.floor(Math.random() * cells.length)];
    }
    const x = Math.floor(cell / 9);
    const y = cell % 9;
    // see if we can remove this from the puzzle
    // check if a cell in the same row, col, or square can be the plucked value
    // if all 3 are true, we can't pluck this value
    let checkRow = false; let checkCol = false; let
      checkSquare = false;
    for (let i = 0; i < 9; i += 1) {
      const row = { x: i, y };
      const col = { x, y: i };
      const square = {
        x: (Math.floor(Math.floor(cell / 9) / 3) * 3) + Math.floor(i / 3),
        y: ((Math.floor(cell / 9) % 3) * 3) + (i % 3),
      };
      if (row.y !== y) {
        checkRow = canBe(puzzleCopy, row.x, row.y, cell);
      }
      if (col.x !== x) {
        checkCol = canBe(puzzleCopy, col.x, col.y, cell);
      }
      if (square.x !== x && square.y !== y) {
        checkSquare = canBe(puzzleCopy, square.x, square.y, cell);
      }
    }
    if (checkRow && checkCol && checkSquare) {
      // removing would make puzzle unsolvable
      // eslint-disable-next-line no-continue
      continue;
    } else {
      // we can pluck this cell!
      puzzleCopy[x][y] = 0;
      cells[cell] = -1;
      count += 1;
    }
  }
  return puzzleCopy;
};
