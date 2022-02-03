import React, { useEffect, useState } from 'react';
import { makePuzzle, pluck } from './utils';
import { Grid, Button, Typography } from '@mui/material';

// TODO - add themes
const COLOR_MAP = [
  '#d40740',
  '#db5e44',
  '#c9a904',
  '#179252',
  '#68e869',
  '#52c5df',
  '#0e57b0',
  '#7748d4',
  '#e00ac6'
];

function App() {

  const [board, setBoard] = useState<number[][] | null>(null);
  const [puzzle, setPuzzle] = useState<number[][] | null>(null);
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [selected, setSelected] = useState([-1, -1]);

  // TODO - add levels (easy, hard, etc)
  const generateGame = (pluckCount = 20) => {
    // make a puzzle solution
    const solution = makePuzzle();
    // reset selected
    setSelected([-1,-1]);
    if (solution) {
      setSolution(solution);
      // copy to make solution immutable
      const solutionCopy = Array.from(solution).map(el=>Array.from(el));
      // pluck values from cells to create the game
      const board = pluck(solutionCopy, pluckCount);
      // copy so board changes do not update puzzle
      const puzzle = Array.from(board).map(el => Array.from(el));
      setPuzzle(puzzle);
      setBoard(board);
    }
  }

  useEffect(() => {
    generateGame();
  }, []);

  const handleSelectSquare = (i: number, j: number) => {
    // check if it is part of the puzzle
    if(puzzle && puzzle[i][j] > 0) return;
    setSelected([i, j]);
  };

  const handlePutColor = (color: number) => {
    const row = selected[0], col = selected[1];
    if(!solution || !board || row < 0 || col < 0) return;
    if(solution[row][col] === (color + 1)) {
      // congrats! you got a square
      board[row][col] = color + 1;
      setBoard([...board]);
    }
  };

  return (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={3} style={{ maxWidth: '400px', width: '100%', padding: '0 10px' }}>
          <Grid container>
            <Grid item xs={12}>
            {board && board.map((row, i) => (
              <div key={i} className="puzzleRow">
                {row.map((cell: number, j: number) => (
                  <div 
                    key={j} 
                    className="puzzleCell" 
                    style={{ 
                      background: COLOR_MAP[cell - 1], 
                      border: selected[0] === i && selected[1] === j ? '2px solid black' : '2px solid white'
                    }} 
                    onClick={() => handleSelectSquare(i, j)}
                    /> 
                ))}
              </div>
            ))}
            </Grid>
            <Grid item xs={12}>
            <div className="colorButtonRow">
              <Typography variant="overline" display="block">COLORS</Typography>
              {COLOR_MAP.map((c, i) => (
                <button 
                  key={i} 
                  className="colorButton" 
                  style={{ background: c }}
                  onClick={() => handlePutColor(i)} 
                />
              ))}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="controls">
                <Button variant="contained" size="small" onClick={() => generateGame()}>new game</Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
    </Grid>
  );
}

export default App;
