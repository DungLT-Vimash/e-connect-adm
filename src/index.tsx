import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import * as serviceWorker from './serviceWorker';

import commonVi from './locates/vi/common.json';
import commonEn from './locates/en/common.json';

const defaultLanguage = () => {
  const language = localStorage.getItem('language');
  if (language != null) {
    return language;
  }

  localStorage.setItem('language', 'vi');
  return 'vi';
};

i18next.init({
  interpolation: { escapeValue: false },
  lng: defaultLanguage(),
  resources: {
    vi: {
      common: commonVi,
    },
    en: {
      common: commonEn,
    },
  },
  defaultNS: 'common',
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333996',
      light: '#3c44b126',
    },
    secondary: {
      main: '#f83245',
      light: '#f8324526',
    },
    background: {
      default: '#f4f5fd',
    },
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

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
