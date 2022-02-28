import {
  useState,
  PropsWithChildren,
  ReactElement,
  ReactInstance,
} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import clsx from 'clsx';
import {
  drawerWidth,
  darkToolbarBackground,
  lightToolbarBackground,
} from '../constants/menu';
import { useAppSelector } from '../app/hooks';
import MenuList from './MenuList';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  darkMode: {
    backgroundColor: darkToolbarBackground,
  },
  lightMode: {
    backgroundColor: lightToolbarBackground,
  },
}));
interface logoutProps {
  logout: () => void;
  state?: boolean;
}

function MyToolbar(
  props: any,
  LogoutProps: PropsWithChildren<logoutProps>
): ReactElement {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const darkMode = useAppSelector(state => state.setting.darkMode);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.darkMode]: darkMode,
          [classes.lightMode]: !darkMode,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {t('setting.title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Drawer
          container={
            container as ReactInstance | (() => ReactInstance | null) | null
          }
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: clsx(classes.drawerPaper, {
              [classes.darkMode]: darkMode,
              [classes.lightMode]: !darkMode,
            }),
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div>
            <div className={classes.toolbar}>
              <Divider />
              <MenuList logout={() => LogoutProps.logout()} />
            </div>
          </div>
        </Drawer>
      </nav>
    </div>
  );
}

export default MyToolbar;
