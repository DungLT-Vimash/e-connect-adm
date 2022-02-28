import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Hidden } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import Paths from '../constants/paths';

import Overview from '../features/Admin/pages/Overview/Overview';
import Agenda from '../features/Admin/pages/Agenda/Agenda';
import Employees from '../features/Admin/pages/Employees/Employees';
import Setting from '../features/Admin/pages/Setting/Setting';
import AgendaDetail from '../features/Admin/pages/AgendaDetail/AgendaDetail';
import CreateEmployee from '../features/Admin/pages/Employees/pages/CreateEmployee/CreateEmployee';
import EmployeeDetail from '../features/Admin/pages/Employees/pages/EmployeeDetail/EmployeeDetail';
import { isLogin } from '../features/Auth/Login/token';
// import useStyles from './Routes.style';

import { Login } from '../features/Auth/Login/Login';
import ToolbarSxDown from './Toolbar.xsDown';
import ToolbarSmUp from './Toolbar.smUp';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  content: {
    height: '100%',
    minWidth: 200,
    flexGrow: 1,
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(6),
    },
  },
}));

export function Routers() {
  const classes = useStyles();
  const [state, setState] = useState({ login: true });

  if (isLogin() === false) {
    return (
      <Router>
        <Switch>
          <Route exact path={Paths.LOGIN}>
            <Login
              login={() => {
                setState({ login: false });
              }}
            />
          </Route>

          <Redirect to={Paths.LOGIN} />
        </Switch>
      </Router>
    );
  }
  setTimeout(() => {}, 300);
  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <Hidden smDown implementation="css">
          <ToolbarSxDown
            logout={() => {
              setState({ login: true });
            }}
          />
        </Hidden>
        <Hidden mdUp implementation="css">
          <ToolbarSmUp
            logout={() => {
              setState({ login: true });
            }}
          />
        </Hidden>
        <main className={classes.content}>
          <Switch>
            <Route exact path={Paths.AGENDA_DETAIL}>
              <AgendaDetail />
            </Route>
            <Route exact path={Paths.AGENDA}>
              <Agenda />
            </Route>
            <Route exact path={Paths.EMPLOYEES}>
              <Employees />
            </Route>
            <Route exact path={Paths.SETTING}>
              <Setting />
            </Route>
            <Route exact path={Paths.CREATE_EMPLOYEE}>
              <CreateEmployee />
            </Route>
            <Route exact path={Paths.EMPLOYEES_DETAIL}>
              <EmployeeDetail />
            </Route>
            <Route exact path={Paths.OVERVIEW}>
              <Overview />
            </Route>
            <Redirect from="/" to={Paths.OVERVIEW} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}
