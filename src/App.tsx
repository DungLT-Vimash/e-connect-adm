import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Routers } from './routes/Routes';
import { useAppSelector } from './app/hooks';

function App() {
  const darkMode = useAppSelector(states => states.setting.darkMode);
  const type = darkMode ? 'dark' : 'light';

  const theme = createMuiTheme({
    palette: {
      type,
    },
    typography: {
      fontFamily: '"Source Sans Pro", sans-serif',
    },
    overrides: {
      MuiAppBar: {
        root: {
          transform: 'translateZ(0)',
        },
      },
    },
    props: {
      MuiIconButton: {
        disableRipple: true,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routers />
    </ThemeProvider>
  );
}

export default App;
