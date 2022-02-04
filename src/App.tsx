import React, { useState } from 'react';

// material
import { styled } from '@mui/material/styles';
import {
  Grid,
  Button,
  Typography,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { makePuzzle, pluck } from './utils';

// TODO - add themes
// styles
const COLOR_MAP = [
  '#e34234',
  '#ff8c00',
  '#f5c71a',
  '#b2ec5d',
  '#228b22',
  '#52c5df',
  '#0e57b0',
  '#7748d4',
  '#e00ac6',
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 2,
  p: 2,
};

const StyledClearIcon = styled(ClearIcon)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-48%, -50%)',
  fontSize: '20px',
}));

const ContainerGrid = styled(Grid)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
}));

const ControlButton = styled(Button)(() => ({
  padding: '5px 10px',
  fontSize: '10px',
  borderRadius: '0',
}));

const CloseModalButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '5px',
  right: '5px',
}));

function App() {
  const [board, setBoard] = useState<number[][] | null>(null);
  const [puzzle, setPuzzle] = useState<number[][] | null>(null);
  const [solution, setSolution] = useState<number[][] | null>(null);
  const [selected, setSelected] = useState([-1, -1]);
  const [wrong, setWrong] = useState<number[][]>();
  const [gameModalOpen, setGameModalOpen] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [level, setLevel] = useState('20');
  const [hint, setHint] = useState('');
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const generateGame = () => {
    // make a puzzle solution
    const newSolution = makePuzzle();
    // reset selected
    setSelected([-1, -1]);
    if (newSolution) {
      setSolution(newSolution);
      // copy to make solution immutable
      const solutionCopy = newSolution.map((arr) => arr.slice());
      // pluck values from cells to create the game
      const newBoard = pluck(solutionCopy, parseInt(level, 10));
      // copy so board changes do not update puzzle
      const newPuzzle = Array.from(newBoard).map((el) => Array.from(el));
      setPuzzle(newPuzzle);
      setBoard(newBoard);
    }
  };

  const checkSquares = () => {
    if (!board || !solution || !puzzle) return;
    const wrongCells = [];
    let correctCount = 0;
    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board[i].length; j += 1) {
        if (board[i][j] !== 0 && board[i][j] !== solution[i][j]) wrongCells.push([i, j]);
        else if (board[i][j] === solution[i][j] && puzzle[i][j] === 0) correctCount += 1;
      }
    }
    setWrong(wrongCells);
    if (correctCount === parseInt(level, 10)) setWon(true);
  };

  const getWrongSquare = () => {
    if (!wrong || wrong.length === 0) return;
    const wrongSquare = wrong[Math.floor(Math.random() * wrong.length)];
    if (!wrongSquare) return;
    setHint(`square at row ${wrongSquare[0] + 1}, column ${wrongSquare[1] + 1} is wrong.`);
  };

  const handleSelectSquare = (i: number, j: number) => {
    // check if it is part of the puzzle
    if (puzzle && puzzle[i][j] > 0) return;
    setSelected([i, j]);
  };

  const handleSelectSquareKeyDown = (e: React.KeyboardEvent, i: number, j: number) => {
    if (e.key === 'enter') {
      handleSelectSquare(i, j);
    }
  };

  const handlePutColor = (color: number) => {
    const row = selected[0]; const
      col = selected[1];
    if (!board || row < 0 || col < 0) return;
    board[row][col] = color + 1;
    setBoard([...board]);
    // collect right and wrong squares
    checkSquares();
  };

  const handleErase = () => {
    const row = selected[0]; const
      col = selected[1];
    if (!puzzle || !board || row < 0 || col < 0) return;
    // check if part of puzzle
    if (puzzle[row][col] === 0) {
      // we can erase this
      board[row][col] = -1;
      setBoard([...board]);
    }
  };

  const handleGameModalClose = () => {
    setGameModalOpen(false);
  };

  const handleHelpModalClose = () => {
    setHint('');
    setHelpModalOpen(false);
  };

  const handleWonModalClose = () => {
    setWon(false);
  };

  const handleNewGame = () => {
    setGameModalOpen(true);
  };

  const handleHelpModalOpen = () => {
    setHelpModalOpen(true);
  };

  const handleLevelChange = (e: SelectChangeEvent<string>) => {
    setLevel(e.target.value);
  };

  const handleStartGame = () => {
    setGameModalOpen(false);
    setStartTime(Date.now());
    generateGame();
  };

  const getElapsedTime = () => {
    let timeDiff = (Date.now() - startTime) / 1000;
    const seconds = Math.floor(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60);
    const minutes = timeDiff % 60;
    timeDiff = Math.floor(timeDiff / 60);
    const hours = timeDiff % 24;

    let timeStr = '';
    if (hours > 0) {
      timeStr += `${hours}:`;
    }
    timeStr += `${minutes}:${seconds}`;

    return timeStr;
  };

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
            {board && board.map((row, i) => {
              let cellNum = 0;
              return (
                <div key={i} className="puzzleRow">
                  {row.map((cell: number, j: number) => {
                    cellNum += 1;
                    return (
                      <div
                        key={j}
                        className={`puzzleCell ${puzzle && puzzle[i][j] === 0 && board && board[i][j] !== 0 ? 'guess' : null}`}
                        style={{
                          background: COLOR_MAP[cell - 1],
                          boxShadow: selected[0] === i && selected[1] === j ? 'inset 0px 0px 0px 2px #000' : 'none',
                        }}
                        onClick={() => handleSelectSquare(i, j)}
                        onKeyDown={(e) => handleSelectSquareKeyDown(e, i, j)}
                        role="button"
                        tabIndex={cellNum}
                      />
                    );
                  })}
                </div>
              );
            })}
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
              <ControlButton style={{ marginRight: '10px' }} variant="outlined" onClick={handleHelpModalOpen}>
                need help?
              </ControlButton>
              <ControlButton variant="outlined" onClick={handleNewGame}>
                new game
              </ControlButton>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={gameModalOpen}
        onClose={handleGameModalClose}
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
          </div>
        </Box>
      </Modal>
      <Modal
        open={helpModalOpen}
        onClose={handleHelpModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <CloseModalButton onClick={handleHelpModalClose}><ClearIcon /></CloseModalButton>
          <Typography id="modal-modal-title" variant="h6" gutterBottom>
            need some help?
          </Typography>
          <Typography gutterBottom>
            {wrong ? wrong.length : '0'}
            {' '}
            squares are wrong
          </Typography>
          {hint.length > 0 ? (
            <Typography display="block" style={{ marginTop: '10px' }}>{hint}</Typography>
          ) : null}
          {wrong && wrong.length > 0 ? (
            <div style={{ marginBottom: '10px', marginTop: '20px', textAlign: 'center' }}>
              <ControlButton variant="outlined" onClick={getWrongSquare}>{hint.length > 0 ? 'another hint?' : 'need a hint?'}</ControlButton>
            </div>
          ) : null }
        </Box>
      </Modal>
      <Modal
        open={won}
        onClose={handleWonModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <CloseModalButton onClick={handleWonModalClose}><ClearIcon /></CloseModalButton>
          <Typography id="modal-modal-title" variant="h6" gutterBottom>
            you won!!!!
          </Typography>
          <Typography display="block">
            that puzzle took you
            {' '}
            {getElapsedTime()}
            {' '}
            seconds
          </Typography>
          <div style={{ marginBottom: '10px', marginTop: '20px', textAlign: 'center' }}>
            <ControlButton variant="outlined" onClick={() => { handleWonModalClose(); handleNewGame(); }}>play again?</ControlButton>
          </div>
        </Box>
      </Modal>
    </ContainerGrid>
  );
}

export default App;
