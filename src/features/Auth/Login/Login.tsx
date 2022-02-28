import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {
  Backdrop,
  CircularProgress,
  InputLabel,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useAppSelector } from '../../../app/hooks';
import { selectLogin, LoginInterface, handleLogin } from './loginSlice';
import { isLogin } from './token';

interface Props {
  login: () => void;
}
export const Login: React.FC<Props> = ({ login }) => {
  const { t } = useTranslation();

  const validationSchema = yup.object({
    phoneNumber: yup
      .string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, t('common.phoneFormat'))
      .required(t('common.required')),
    password: yup.string().required(t('common.required')),
  });

  const dispatch = useDispatch();
  const [state, setState] = useState({
    message: '',
  });
  const useStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    loginWrapper: {
      margin: '0 28%',
      minHeight: '30rem',
      paddingTop: '1px',
      marginTop: '3rem',
      '& > main > div': {
        marginTop: '50px',
      },
      [theme.breakpoints.down('xs')]: {
        margin: '0 10%',
        minHeight: '30rem',
        paddingTop: '1px',
        marginTop: '3rem',
        '& > main > div': {
          marginTop: '50px',
        },
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const loginSelector = useAppSelector(selectLogin);
  const history = useHistory();
  function phonenumber(inputtxt: string) {
    const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (inputtxt.match(phoneno)) {
      return true;
    }
    return false;
  }
  useEffect(() => {
    if (isLogin()) {
      history.replace('/');
      login();
    }
    if (loginSelector.message === 'Rejected') {
      setState({ message: `${t('login.message')} ` });
      setOpen(false);
    } else setState({ message: '' });
  }, [
    dispatch,
    history,
    login,
    loginSelector.isLoading,
    loginSelector.message,
    t,
  ]);
  return (
    <Formik
      initialValues={{
        phoneNumber: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const temp: LoginInterface = {
          phoneNumber: values.phoneNumber,
          password: values.password,
        };
        if (phonenumber(values.phoneNumber) === true) {
          setOpen(true);
          setTimeout(() => {
            dispatch(handleLogin(temp));
          }, 3000);
        } else setState({ message: `${t('login.phoneNumber')}` });
      }}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <>
          <Paper className={classes.loginWrapper}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  {`${t('login.signIn')}`}
                </Typography>
                <Form className={classes.form} onSubmit={handleSubmit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="phoneNumber"
                    label={`${t('login.telephone')}*`}
                    name="phoneNumber"
                    type="text"
                    onChange={(e: any) => {
                      setState({ message: '' });
                      return handleChange(e);
                    }}
                    onBlur={handleBlur}
                    value={values.phoneNumber}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    error={touched.phoneNumber && !!errors.phoneNumber}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label={`${t('login.password')}*`}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e: any) => {
                      setState({ message: '' });
                      return handleChange(e);
                    }}
                    onBlur={handleBlur}
                    value={values.password}
                    helperText={touched.password && errors.password}
                    error={touched.password && !!errors.password}
                  />
                  <InputLabel error>{state.message}</InputLabel>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    {`${t('login.signIn')} `}
                  </Button>
                </Form>
              </div>
            </Container>
          </Paper>
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
    </Formik>
  );
};
