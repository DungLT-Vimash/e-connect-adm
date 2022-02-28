import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Input from '../../../../../../components/controls/Input';
import Button from '../../../../../../components/controls/Button';
import AccountInfomations, {
  IErrors,
  ITouched,
  IValues,
} from '../../components/AccountInfomations/AccountInfomations';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import {
  clearStatusInfo,
  createEmployee,
  selectEmployees,
} from '../../employeesSlice';
import {
  createDate,
  password,
} from '../../../../../../constants/employeesConst';
import Notification from '../../../../../../components/Notification/Notification';

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
  },

  '.MuiOutlinedInput-input': {
    padding: '11.5px 14px',
  },

  typoHeader: {
    marginBottom: theme.spacing(2),
  },
  styleControls: {
    marginBottom: '1rem',
  },

  cancelButton: {
    color: '#fff',
  },

  submitButton: {
    marginRight: '1rem',
    backgroundColor: theme.palette.success.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2e7d32',
      transition: 'backgroundColor ease-in-out 0.3s',
    },
  },

  styleButtonGroup: {
    marginTop: '1rem',
  },

  buttonGroupResp: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '0.5rem',
    },
  },
}));

export interface IEmployee {
  fullName: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  birthDay: Date | string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  gender: number;
  status: boolean;
  province: number | string;
  district: number | string;
  userName: string | undefined;
  password: string | undefined;
}

const CreateEmployee = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { statusInfo } = useAppSelector(selectEmployees);

  const { t } = useTranslation();

  const validationSchema = yup.object({
    firstName: yup.string().required(t('common.required')),
    lastName: yup.string().required(t('common.required')),
    email: yup
      .string()
      .required(t('common.required'))
      .email(t('common.mailFormat')),
    birthDay: yup.date(),
    phoneNumber: yup
      .string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, t('common.phoneFormat'))
      .required(t('common.required')),
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  const initialValues: IEmployee = {
    fullName: '',
    firstName: '',
    lastName: '',
    birthDay: createDate(0, 0, -18),
    email: '',
    phoneNumber: '',
    status: false,
    gender: 0,
    province: 0,
    district: 0,
    userName: '',
    password,
  };
  const {
    values: { userName, ...otherValues },
    errors: { userName: errorUsername, ...otherErrors },
    touched: { userName: touchedUserName, ...otherTouched },
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (data: IEmployee) => {
      dispatch(createEmployee({ ...data, userName: data.phoneNumber }));
    },
  });

  useEffect(() => {
    if (statusInfo) {
      if (
        !(
          statusInfo.status === 200 ||
          statusInfo.status === 201 ||
          statusInfo.status === 202 ||
          statusInfo.status === 203 ||
          statusInfo.status === 204
        )
      ) {
        setNotify({
          isOpen: true,
          message: statusInfo.msg,
          type: 'error',
        });
        dispatch(clearStatusInfo());
      }

      if (
        statusInfo?.status === 200 ||
        statusInfo?.status === 201 ||
        statusInfo?.status === 202 ||
        statusInfo?.status === 203 ||
        statusInfo?.status === 204
      ) {
        setTimeout(() => {
          history.push('/employees');
        }, 250);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusInfo, history]);

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <Paper className={classes.pageContent}>
          <Typography
            className={classes.typoHeader}
            variant="h4"
            component="h4"
          >
            {t('employees.newEmployee')}
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <AccountInfomations
                values={otherValues as IValues}
                errors={otherErrors as IErrors}
                touched={otherTouched as ITouched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                disabledEmail={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                className={classes.styleControls}
                variant="h6"
                component="h6"
              >
                {t('employees.accountLogin')}
              </Typography>
              <div>
                <Input
                  className={classes.styleControls}
                  name="userName"
                  type="text"
                  label={`${t('employees.userName')}*`}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={otherValues.phoneNumber}
                  InputProps={{}}
                  disabled
                  error=""
                />
              </div>
              <div>
                <Input
                  type="password"
                  className={classes.styleControls}
                  name="password"
                  label={`${t('employees.password')}*`}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={password}
                  InputProps={{}}
                  disabled
                  error=""
                />
              </div>
            </Grid>
          </Grid>
          <div
            className={clsx(classes.styleButtonGroup, classes.buttonGroupResp)}
          >
            <Button
              text={t('employees.add')}
              className={classes.submitButton}
              type="submit"
              size="large"
              color="default"
              variant="contained"
              onClick={() => {}}
              startIcon={null}
            />
            <Button
              text={t('employees.cancel')}
              color="inherit"
              onClick={() => {
                history.push('/employees');
              }}
              type="button"
              size="large"
              variant="contained"
              startIcon={null}
              className={classes.cancelButton}
            />
          </div>
        </Paper>
      </form>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};

export default CreateEmployee;
