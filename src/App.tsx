import React, { useState, useEffect } from 'react';

// material
import {
  Grid,
  Typography,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { makePuzzle, pluck } from './utils';
import {
  COLOR_MAP,
  COLOR_NAMES,
  SYMBOL_MAP,
  modalStyle,
  StyledClearIcon,
  ContainerGrid,
  ControlButton,
  CloseModalButton,
} from './theme';

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
  const [useSymbols, setUseSymbols] = useState(false);
  const [colorCount, setColorCount] = useState<{[key: number]: number }>({});

  const checkSquares = () => {
    if (!board || !solution || !puzzle) return;
    const wrongCells = [];
    let correctCount = 0;
    const newColorCount: {[key: number]: number } = {};
    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board[i].length; j += 1) {
        if (board[i][j] !== 0 && board[i][j] !== solution[i][j]) wrongCells.push([i, j]);
        else if (board[i][j] === solution[i][j] && puzzle[i][j] === 0) correctCount += 1;
        // get count of each for dimming buttons
        if (Object.prototype.hasOwnProperty.call(newColorCount, board[i][j] - 1)) {
          newColorCount[board[i][j] - 1] += 1;
        } else {
          newColorCount[board[i][j] - 1] = 1;
        }
      }
    }
    setColorCount(newColorCount);
    setWrong(wrongCells);
    if (correctCount === parseInt(level, 10)) setWon(true);
  };

  const getWrongSquare = () => {
    if (!board || !solution) return;
    if (!wrong || wrong.length === 0) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      let missingSquare = board[row][col];
      // get random square from solution that is not on board yet
      while (missingSquare !== 0) {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
        missingSquare = board[row][col];
      }
      setHint(`square at row ${row + 1}, column ${col + 1} is ${COLOR_NAMES[solution[row][col] - 1]}.`);
    } else {
      const wrongSquare = wrong[Math.floor(Math.random() * wrong.length)];
      setHint(`square at row ${wrongSquare[0] + 1}, column ${wrongSquare[1] + 1} is wrong.`);
    }
  };

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

  useEffect(() => {
    // check squares on each board update
    checkSquares();
  }, [board]);

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
  };

  const handleErase = () => {
    const row = selected[0]; const
      col = selected[1];
    if (!puzzle || !board || row < 0 || col < 0) return;
    // check if part of puzzle
    if (puzzle[row][col] === 0) {
      // we can erase this
      board[row][col] = 0;
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

  const handleChangeToSymbols = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseSymbols(e.target.checked);
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
                    if (useSymbols) {
                      return (
                        <div
                          key={j}
                          className={`puzzleCell symbol ${puzzle && puzzle[i][j] === 0 && board && board[i][j] !== 0 ? 'guess' : null}`}
                          style={{
                            boxShadow: selected[0] === i && selected[1] === j ? 'inset 0px 0px 0px 2px #000' : 'none',
                          }}
                          onClick={() => handleSelectSquare(i, j)}
                          onKeyDown={(e) => handleSelectSquareKeyDown(e, i, j)}
                          role="button"
                          tabIndex={cellNum}
                        >
                          <div className="emoji">
                            {cell > 0 ? SYMBOL_MAP[cell - 1] : null}
                          </div>
                        </div>
                      );
                    }
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
              <Typography variant="overline" display="block">
                {useSymbols ? 'EMOJIS' : 'COLORS'}
              </Typography>
              {useSymbols ? SYMBOL_MAP.map((c, i) => (
                <button
                  key={i}
                  className={`colorButton symbol ${colorCount[i] === 9 ? 'dimmed' : ''}`}
                  onClick={() => handlePutColor(i)}
                  {...colorCount[i] === 9 ? { disabled: true } : null}
                >
                  <div className="emoji">{c}</div>
                </button>
              )) : COLOR_MAP.map((c, i) => (
                <button
                  key={i}
                  className={`colorButton ${colorCount[i] === 9 ? 'dimmed' : ''}`}
                  style={{ background: c }}
                  onClick={() => handlePutColor(i)}
                  {...colorCount[i] === 9 ? { disabled: true } : null}
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
            <Typography variant="caption" display="block" style={{ marginBottom: '20px' }}>a color-based sudoku game</Typography>
            <Typography gutterBottom>
              each color acts as 1-9 in a classic game of sudoku
            </Typography>
            <Typography>if you&apos;re not into rainbows, use the emoji version 😎</Typography>
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
          <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
            <FormControlLabel
              control={(
                <Switch
                  checked={useSymbols}
                  onChange={handleChangeToSymbols}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              )}
              label="use emojis"
            />
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
          <div style={{ marginBottom: '10px', marginTop: '20px', textAlign: 'center' }}>
            <ControlButton variant="outlined" onClick={getWrongSquare}>{hint.length > 0 ? 'another hint?' : 'need a hint?'}</ControlButton>
          </div>
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
