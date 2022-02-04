import { createTheme, styled } from '@mui/material/styles';
import {
  Grid,
  Button,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export const COLOR_MAP = [
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

export const COLOR_NAMES = [
  'red',
  'orange',
  'yellow',
  'lime green',
  'dark green',
  'light blue',
  'dark blue',
  'purple',
  'pink',
];

export const SYMBOL_MAP = [
  '🔥',
  '👽',
  '🙃',
  '💦',
  '👅',
  '👿',
  '🌵',
  '👻',
  '🖤',
];

export const modalStyle = {
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

export const StyledClearIcon = styled(ClearIcon)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-48%, -50%)',
  fontSize: '20px',
}));

export const ContainerGrid = styled(Grid)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
}));

export const ControlButton = styled(Button)(() => ({
  padding: '5px 10px',
  fontSize: '10px',
  borderRadius: '0',
}));

export const CloseModalButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: '5px',
  right: '5px',
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
});

export default theme;
