import { useEffect, useState } from 'react';
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import {
  Avatar,
  Badge,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import InfoBox from '../../../../components/InfoBox';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  getTotalEmployee,
  getDayOfToday,
  getNotification,
} from './overviewSlice';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    boxSizing: 'border-box',
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    text: 'left',
    borderRadius: '1.5rem',
    width: '200px',
    height: '150px',
    margin: '20px 20px',
  },
  number: {
    fontSize: '4rem',
    color: 'black',
  },
  paperGroup: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
    },
  },
  icon: {
    backgroundColor: '#ff5d6d',
    color: 'white',
    borderRadius: '50%',
    padding: '3px',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    padding: '2px 10px',
  },
  typoHeader: {
    marginBottom: theme.spacing(2),
  },
  fontIcon: {
    '& svg': {
      fontSize: '2rem',
    },
  },
  space: {
    justifyContent: 'space-between',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
}));

export default function NestedGrid() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const date = new Date();
    dispatch(getDayOfToday(moment(date).toISOString()));
    dispatch(getTotalEmployee());
    dispatch(getNotification(false));
  }, [dispatch]);

  const totalEmployee = useAppSelector(
    state => state.overview.overview.totalEmployees
  );

  const dayOffToday = useAppSelector(
    state => state.overview.overview.dayOffToday
  );

  const notificationNumber = useAppSelector(
    state => state.overview.overview.notification
  );

  const notificationList = useAppSelector(state => state.overview.agenda);

  const isLoading = useAppSelector(state => state.overview.isLoading);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const LightTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      marginLeft: 10,
    },
  }))(Tooltip);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid container justify="space-between" item xs={12}>
          <div className={classes.space}>
            <Typography
              className={classes.typoHeader}
              variant="h4"
              component="h4"
            >
              {t('overview.overview')}
            </Typography>

            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div>
                <LightTooltip
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  placement="bottom"
                  onClose={handleTooltipClose}
                  open={open}
                  title={
                    notificationList.length > 0 ? (
                      <List className={classes.root}>
                        {notificationList.map((item: any) => (
                          <ListItem key={item._id}>
                            <ListItemAvatar>
                              <Avatar>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText>{item.name}</ListItemText>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <div>{t('overview.thongbao')}</div>
                    )
                  }
                >
                  <IconButton
                    aria-label="show notifications"
                    color="inherit"
                    onClick={handleTooltipOpen}
                  >
                    <Badge
                      badgeContent={notificationNumber}
                      className={classes.fontIcon}
                      color="secondary"
                    >
                      <NotificationsNoneIcon />
                    </Badge>
                  </IconButton>
                </LightTooltip>
              </div>
            </ClickAwayListener>
          </div>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <div className={classes.paperGroup}>
            <InfoBox
              Icon={PermIdentityIcon}
              color="#dbe32a"
              textTitle={t('overview.employees')}
              numberTitle={totalEmployee}
              path="/employees"
              isLoading={isLoading}
            />
            <InfoBox
              Icon={AccessAlarmIcon}
              color="#5dd60b"
              textTitle={t('overview.dayofftoday')}
              numberTitle={dayOffToday}
              path="/agenda"
              isLoading={isLoading}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
