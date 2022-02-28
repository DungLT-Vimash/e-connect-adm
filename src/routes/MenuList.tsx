import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState, PropsWithChildren, ReactElement } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import OverviewIcon from '@material-ui/icons/TripOrigin';
import AgendaIcon from '@material-ui/icons/MailOutline';
import EmployeesIcon from '@material-ui/icons/PersonOutline';
import SettingIcon from '@material-ui/icons/SettingsOutlined';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import { clearTokenService } from '../features/Auth/Login/token';
import Paths from '../constants/paths';

export const defaultMenuColor = 'white';
export const selectionMenuColor = 'gray';

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingTop: 16,
    paddingBottom: 16,
    '& svg': {
      fontSize: 24,
      color: defaultMenuColor,
      [theme.breakpoints.up('sm')]: {
        fontSize: 36,
      },
    },
    '& span': {
      color: defaultMenuColor,
      fontSize: '1rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.2rem',
      },
    },
  },
  listItemSelected: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: theme.palette.background.default,
    '& svg': {
      fontSize: 24,
      color: selectionMenuColor,
      [theme.breakpoints.up('sm')]: {
        fontSize: 36,
      },
    },
    '& span': {
      color: selectionMenuColor,
      fontSize: '1rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.2rem',
      },
    },
  },
}));

interface MenuItemProps {
  children: React.ReactNode;
  title: string;
  path: string;
  currentPath: string;
  handleChangePath: (path: string) => void;
}

function MenuItem(props: MenuItemProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { children, title, path, currentPath, handleChangePath } = props;

  const classStyle =
    currentPath === path ? classes.listItemSelected : classes.listItem;

  return (
    <ListItem
      button
      className={classStyle}
      onClick={() => handleChangePath(path)}
    >
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText primary={t(title)} />
    </ListItem>
  );
}
interface LogoutProps {
  path: string;
  handleChangePath: (path: string) => void;
  logout: () => void;
}
function LogoutMenu(props: LogoutProps) {
  const { path, handleChangePath } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const clearToken = (newPath: string) => {
    clearTokenService();
    history.push(newPath);
    props.logout();
  };

  return (
    <ListItem
      button
      className={classes.listItem}
      onClick={() => clearToken(path)}
    >
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary={t('menu.logout')} />
    </ListItem>
  );
}
interface logoutProps {
  logout: () => void;
}

export default function MenuList(
  props: PropsWithChildren<logoutProps>
): ReactElement {
  const history = useHistory();
  const location = useLocation();

  const [path, setPath] = useState(location.pathname);

  const handleChangePath = (pathname: string) => {
    history.push(pathname);
  };

  useEffect(() => {
    const { pathname } = location;
    const pathItems = pathname.split('/');
    const currentPath = pathItems.length >= 1 ? pathItems[1] : '';
    setPath(`/${currentPath}`);
  }, [location]);

  return (
    <List>
      <MenuItem
        title="menu.overview"
        currentPath={path}
        handleChangePath={handleChangePath}
        path={Paths.OVERVIEW}
      >
        <OverviewIcon />
      </MenuItem>
      <MenuItem
        title="menu.agenda"
        currentPath={path}
        handleChangePath={handleChangePath}
        path={Paths.AGENDA}
      >
        <AgendaIcon />
      </MenuItem>
      <MenuItem
        title="menu.employees"
        currentPath={path}
        handleChangePath={handleChangePath}
        path={Paths.EMPLOYEES}
      >
        <EmployeesIcon />
      </MenuItem>
      <MenuItem
        title="menu.setting"
        currentPath={path}
        handleChangePath={handleChangePath}
        path={Paths.SETTING}
      >
        <SettingIcon />
      </MenuItem>
      <LogoutMenu
        logout={() => props.logout()}
        path={Paths.LOGIN}
        handleChangePath={handleChangePath}
      />
    </List>
  );
}
