import { useState, PropsWithChildren, ReactElement } from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/DragHandle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { makeStyles } from '@material-ui/core/styles';
import {
  drawerWidth,
  backgroundColor,
  lightToolbarBackground,
  darkToolbarBackground,
} from '../constants/menu';
import { useAppSelector } from '../app/hooks';
import MenuList, { defaultMenuColor } from './MenuList';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    fontSize: 24,
    color: defaultMenuColor,
    [theme.breakpoints.up('md')]: {
      fontSize: 36,
    },
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    backgroundColor,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    border: 0,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(9) + 1,
    },
    border: 0,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
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
}

export default function Toolbar(
  LogoutProps: PropsWithChildren<logoutProps>
): ReactElement {
  const classes = useStyles();
  const darkMode = useAppSelector(state => state.setting.darkMode);
  const [open, setOpen] = useState(false);

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
        [classes.darkMode]: darkMode,
        [classes.lightMode]: !darkMode,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
          [classes.darkMode]: darkMode,
          [classes.lightMode]: !darkMode,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {open ? (
            <ChevronLeftIcon className={classes.menuButton} />
          ) : (
            <MenuIcon className={classes.menuButton} />
          )}
        </IconButton>
      </div>

      <MenuList logout={() => LogoutProps.logout()} />
    </Drawer>
  );
}
