import React, { useState } from 'react';
import { makePuzzle, pluck } from './utils';

// material
import { styled } from '@mui/material/styles';
import { Grid, Button, Typography, Modal, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

// TODO - add themes
const COLOR_MAP = [
  '#e34234', 
  '#ff8c00',
  '#f5c71a',
  '#b2ec5d',
  '#228b22',
  '#52c5df',
  '#0e57b0',
  '#7748d4',
  '#e00ac6'
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 2,
  p: 2,
};

function App() {

  const [board, setBoard] = useState<number[][] | null>(null);
  const [puzzle, setPuzzle] = useState<number[][] | null>(null);
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [selected, setSelected] = useState([-1, -1]);
  const [wrong, setWrongCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(true);
  const [level, setLevel] = useState('20');

  // TODO - use wrong somehow - hint reveals how many wrong/hightlights wrong square?
  const generateGame = () => {
    // make a puzzle solution
    const solution = makePuzzle();
    // reset selected
    setSelected([-1,-1]);
    if (solution) {
      setSolution(solution);
      // copy to make solution immutable
      const solutionCopy = Array.from(solution).map(el=>Array.from(el));
      // pluck values from cells to create the game
      const board = pluck(solutionCopy, parseInt(level, 10));
      // copy so board changes do not update puzzle
      const puzzle = Array.from(board).map(el => Array.from(el));
      setPuzzle(puzzle);
      setBoard(board);
    }
  }

  const handleSelectSquare = (i: number, j: number) => {
    // check if it is part of the puzzle
    if(puzzle && puzzle[i][j] > 0) return;
    setSelected([i, j]);
  };

  const handlePutColor = (color: number) => {
    const row = selected[0], col = selected[1];
    if(!solution || !board || row < 0 || col < 0) return;
    // congrats! you got a square
    board[row][col] = color + 1;
    setBoard([...board]);
    if(solution[row][col] !== (color + 1)) {
      setWrongCount(wrong + 1);
    }
  };

  const handleErase = () => {
    const row = selected[0], col = selected[1];
    if(!puzzle || !board || row < 0 || col < 0) return;
    // check if part of puzzle
    if(puzzle[row][col] === 0) {
      // we can erase this
      board[row][col] = -1;
      setBoard([...board]);
    }
  }

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleLevelChange = (e: SelectChangeEvent<string>) => {
    setLevel(e.target.value);
  };

  const handleStartGame = () => {
    setModalOpen(false);
    generateGame();
  };

  const handleNewGame = () => {
    setModalOpen(true);
  }

  return (
    <ContainerGrid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={3} style={{ maxWidth: '400px', width: '100%', padding: '0 10px' }}>
          <Grid container>
            <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '10px' }}>
              <Typography variant="h5" display="block">sudokolor!</Typography>
              <Typography variant="caption" display="block" gutterBottom>a color-based sudoku game</Typography>
            </Grid>
            <Grid item xs={12}>
            {board && board.map((row, i) => (
              <div key={i} className="puzzleRow">
                {row.map((cell: number, j: number) => (
                  <div 
                    key={j} 
                    className={`puzzleCell ${puzzle && puzzle[i][j] === 0 && board && board[i][j] !== 0 ? 'guess': null}`}
                    style={{ 
                      background: COLOR_MAP[cell - 1], 
                      boxShadow: selected[0] === i && selected[1] === j ? 'inset 0px 0px 0px 2px #000' : 'none'
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
              <button className="colorButton erase" onClick={handleErase}>
                <StyledClearIcon />
              </button>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="controls">
                <ControlButton variant="outlined" onClick={handleNewGame}>
                  new game
                </ControlButton>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <Typography id="modal-modal-title" variant="h6">
                sudokolor!
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>a color-based sudoku game</Typography>
            </div>
            <div>
            <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
            <InputLabel id="level-select-label">level</InputLabel>
            <Select
              labelId="level-select-label"
              id="level"
              value={level}
              label="Level"
              onChange={handleLevelChange}
            >
              <MenuItem value={20}>easy</MenuItem>
              <MenuItem value={30}>not too bad</MenuItem>
              <MenuItem value={40}>hard</MenuItem>
              <MenuItem value={50}>really hard</MenuItem>
              <MenuItem value={60}>almost impossible</MenuItem>
            </Select>
          </FormControl>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <ControlButton variant="outlined" onClick={handleStartGame}>let&apos;s go</ControlButton>
            </div></div>
          </Box>
        </Modal>
    </ContainerGrid>
  );
}

const StyledClearIcon = styled(ClearIcon)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-48%, -50%)',
  fontSize: '20px'
}));

const ContainerGrid = styled(Grid)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)'
}));

const ControlButton = styled(Button)(() => ({
  padding: '5px 10px',
  fontSize: '10px',
  borderRadius: '0',
}));

export default App;
