import {
  Grid,
  makeStyles,
  Paper,
  Select,
  Switch,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Brightness4RoundedIcon from '@material-ui/icons/Brightness4Rounded';
import Brightness7RoundedIcon from '@material-ui/icons/Brightness7Rounded';
import LanguageTwoToneIcon from '@material-ui/icons/LanguageTwoTone';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { setDarkMode } from './settingSlice';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    boxSizing: 'border-box',
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
    fontSize: '3.5rem',
  },
  space: {
    justifyContent: 'space-between',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  label: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  select: {
    marginLeft: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    textAlign: 'right',
    color: theme.palette.text.secondary,
    borderRadius: '3px',
    width: '250px',
    height: '120px',
    margin: '20px 20px',
    boxShadow: 'rgb(0 0 0 / 30%) 0px 19px 38px, rgb(0 0 0 / 22%) 0px 15px 12px',
  },
  paperItem: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
}));

export default function Setting() {
  const classes = useStyles();
  const checked = useAppSelector(states => states.setting.darkMode);
  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleChange = (event: any) => {
    const saveLanguage = event.target.value;

    i18n.changeLanguage(saveLanguage);
    setLanguage(saveLanguage);
    localStorage.setItem('language', saveLanguage);
  };

  const toggleChecked = () => {
    dispatch(setDarkMode(!checked));
  };

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
              {t('menu.setting')}
            </Typography>
          </div>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <div className={classes.paperGroup}>
            <Paper className={classes.paper}>
              {checked ? (
                <Brightness4RoundedIcon className={classes.fontIcon} />
              ) : (
                <Brightness7RoundedIcon className={classes.fontIcon} />
              )}
              <div className={classes.paperItem}>
                <label className={classes.label} htmlFor="dark-mode">
                  {t('setting.darkMode')}
                </label>

                <Switch
                  id="dark-mode"
                  checked={checked}
                  onChange={toggleChecked}
                />
              </div>
            </Paper>
            <Paper className={classes.paper}>
              <LanguageTwoToneIcon className={classes.fontIcon} />
              <div>
                <label className={classes.label} htmlFor="language">
                  {t('setting.language')}
                </label>

                <Select
                  native
                  id="language"
                  className={classes.select}
                  onChange={handleChange}
                  value={language}
                >
                  <option value="vi">Tiếng việt</option>
                  <option value="en">English</option>
                </Select>
              </div>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
