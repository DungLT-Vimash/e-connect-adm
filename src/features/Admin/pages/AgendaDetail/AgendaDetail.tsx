import {
  Avatar,
  Box,
  TextField,
  Typography,
  Hidden,
  Breadcrumbs,
  Paper,
} from '@material-ui/core';
import moment from 'moment';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useHistory, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import Paths from '../../../../constants/paths';
import Button from '../../../../components/controls/Button';
import Notification from '../../../../components/Notification/Notification';
import {
  cleanStatusInfo,
  getAgendaById,
  updateAgendaStatus,
} from './agendaDetailSlice';

const isDarkMode = localStorage.getItem('darkMode') === 'true';

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
    height: '100%',
  },
  title: {
    fontSize: '1.2rem',
    paddingTop: '10px',
    fontWeight: 'bold',
    marginRight: '5px',
  },
  titleName: {
    marginTop: '3rem',
    [theme.breakpoints.down('xs')]: {
      marginTop: '1.5rem',
    },
  },
  text: {
    fontSize: '1.2rem',
  },
  image: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(14),
      height: theme.spacing(14),
    },
    boxShadow:
      '-2px 4px 9px 6px rgb(0 0 0 / 3%), -1px 5px 11px rgb(0 0 0 / 5%), 0px 14px 14px rgb(0 0 0 / 6%), 13px 0px 17.9px rgb(0 0 0 / 7%), -3px 3px 33.4px rgb(0 0 0 / 9%), 1px 11px 7px rgb(0 0 0 / 12%)',
  },
  button: {
    backgroundColor: green.A700,
    color: 'white',
    fontWeight: 'bold',
  },
  typeHeader: {
    marginBottom: theme.spacing(2),
  },
  styleLink: {
    textDecoration: 'none',
    color: isDarkMode ? '#fff' : '#000',
    '&:focus': {
      color: isDarkMode ? '#fff' : '#000',
    },
  },
  icon: {
    marginTop: '-10px',
    fontSize: '2.5rem',
  },
  iconArrow: {
    fontSize: '0.9rem',
    margin: '0 5px',
  },
  buttonResp: {
    margin: '10px',
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: '#1b5e20',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      padding: '10px 10px',
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end',
    },
  },
  bodyInfomation: {
    marginTop: '3rem',
    marginLeft: '150px',
    marginRight: '150px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
      marginRight: '0',
    },
  },
  infomationItem: {
    marginBottom: '10px',
  },
}));

export default function AgendaDetail() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const agenda = useAppSelector(states => states.agendaDetail.agenda);
  const statusInfo = useAppSelector(states => states.agendaDetail.statusInfo);
  const isLoading = useAppSelector(states => states.agendaDetail.isLoading);

  const { t } = useTranslation();
  const { id }: { id: string } = useParams();

  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  useEffect(() => {
    if (statusInfo !== null) {
      setNotify({
        isOpen: true,
        message: statusInfo.message,
        type:
          statusInfo.error === 200 ||
          statusInfo.error === 201 ||
          statusInfo.error === 202 ||
          statusInfo.error === 203 ||
          statusInfo.error === 204
            ? 'success'
            : 'error',
      });
      dispatch(cleanStatusInfo());
    }
  }, [dispatch, statusInfo]);

  useEffect(() => {
    dispatch(getAgendaById(id));
  }, [dispatch, id]);

  const handleUpdateAgendaStatus = () => {
    if (agenda?.status) {
      history.push(Paths.AGENDA);
    } else {
      dispatch(updateAgendaStatus(id));
    }
  };

  return (
    <div>
      <Paper className={classes.pageContent}>
        <Box className={classes.header} mb={2}>
          <Hidden smDown implementation="css">
            <Breadcrumbs
              separator={<NavigateNextRoundedIcon className={classes.icon} />}
              aria-label="breadcrumb"
            >
              <Typography
                className={classes.typeHeader}
                variant="h4"
                component="h4"
              >
                <NavLink
                  className={classes.styleLink}
                  color="inherit"
                  to="/agenda"
                  style={{ textDecoration: 'none' }}
                >
                  {t('agenda.agenda')}
                </NavLink>
              </Typography>
              <Typography
                className={classes.typeHeader}
                variant="h4"
                component="h4"
              >
                {id}
              </Typography>
            </Breadcrumbs>
          </Hidden>

          {isLoading ? (
            <Skeleton>
              <Button
                text={t('agendaDetail.close')}
                type="button"
                variant="contained"
                size="large"
                color="primary"
                startIcon=""
                className={classes.buttonResp}
                onClick={handleUpdateAgendaStatus}
              />
            </Skeleton>
          ) : (
            <Button
              text={
                agenda?.status
                  ? t('agendaDetail.close')
                  : t('agendaDetail.viewed')
              }
              type="button"
              variant="contained"
              size="large"
              color="primary"
              startIcon=""
              className={classes.buttonResp}
              onClick={handleUpdateAgendaStatus}
            />
          )}
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            {isLoading ? (
              <>
                <Skeleton variant="circle" className={classes.image} />
                <Skeleton variant="text" width={80} />
              </>
            ) : (
              <>
                <Avatar alt="Avatar" className={classes.image} />
                <Typography variant="h5" className={classes.titleName}>
                  {agenda?.name}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {isLoading ? (
          <div>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </div>
        ) : (
          <div className={classes.bodyInfomation}>
            <div className={classes.infomationItem}>
              <span className={classes.title}>
                {`${t('agendaDetail.dateCreated')}: `}
              </span>
              <span className={classes.text}>
                {moment(agenda?.createdAt).format('LL')}
              </span>
            </div>
            <div className={classes.infomationItem}>
              <span className={classes.title}>
                {`${t('agendaDetail.rangeOfDays')}: `}
              </span>
              <span className={classes.text}>{agenda?.dayoff}</span>
            </div>
            <div className={classes.infomationItem}>
              <span className={classes.title}>
                {`${t('agendaDetail.Time')}: `}
              </span>
              <span className={classes.text}>
                {moment(agenda?.startDate).format('LL')}
                <ArrowForwardRoundedIcon className={classes.iconArrow} />
                {moment(agenda?.endDate).format('LL')}
              </span>
            </div>
            <div className={classes.infomationItem}>
              <span className={classes.title}>
                {`${t('agendaDetail.reason')}: `}
              </span>
            </div>
            <div>
              <TextField
                disabled
                multiline
                fullWidth
                variant="outlined"
                rows={5}
                value={agenda?.reason}
              />
            </div>
          </div>
        )}

        <Notification notify={notify} setNotify={setNotify} />
      </Paper>
    </div>
  );
}
