import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import Input from '../../../../../../components/controls/Input';
import Button from '../../../../../../components/controls/Button';
import AccountInfomations, {
  IErrors,
  ITouched,
  IValues,
} from '../../components/AccountInfomations/AccountInfomations';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import {
  clearIsUpdate,
  getEmployeeByIdSlice,
  resetPasswordEmployee,
  selectEmployees,
  updateEmployee,
} from '../../employeesSlice';
import EmployeeForm, {
  IConfirmDialog,
} from '../../components/EmployeeForm/EmployeeForm';
import Popup from '../../../../../../components/Popup/Popup';
import { createDate } from '../../../../../../constants/employeesConst';
import { IEmployee } from '../CreateEmployee/CreateEmployee';
import ConfirmDialog from '../../../../../../components/ConfirmDialog/ConfirmDialog';
import Notification from '../../../../../../components/Notification/Notification';

const useStyles = makeStyles(theme => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  return {
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

    resetButton: {
      marginRight: '1rem',
      backgroundColor: theme.palette.info.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: '#0d47a1',
      },
    },

    buttonGroupResp: {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '0.5rem',
      },
    },

    styleButtonGroup: {
      marginTop: '1rem',
    },

    styleTypo: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
    },

    styleLink: {
      textDecoration: 'none',
      color: isDarkMode ? '#fff' : '#000',
      '&:focus': {
        color: isDarkMode ? '#fff' : '#000',
      },
    },
  };
});

interface IEmployeeDetail extends IEmployee {
  id: string | undefined;
}

const EmployeeDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { employee, statusInfo, isUpdate, isLoading } =
    useAppSelector(selectEmployees);

  const { employeeId } = useParams<{ employeeId: string }>();

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

  const [infoForm, setInfoForm] = useState({
    titleForm: '',
    nameButton: '',
  });

  const [recordForEdit, setRecordForEdit] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  const openInPopup = (item: any) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  const initialValues: IEmployeeDetail = {
    id: '',
    fullName: '',
    firstName: '',
    lastName: '',
    birthDay: createDate(0, 0, -18),
    email: '',
    phoneNumber: '',
    gender: 0,
    status: false,
    province: 0,
    district: 0,
    userName: '',
    password: '',
  };
  const {
    values: { userName, password, ...otherValues },
    errors: {
      userName: errorUsername,
      password: errorPassword,
      ...otherErrors
    },
    touched: {
      userName: touchedUserName,
      password: touchedPassword,
      ...otherTouched
    },
    setValues,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (data: IEmployee) => {
      dispatch(
        updateEmployee({
          id: employeeId,
          data: { ...data, userName: data.phoneNumber },
        })
      );
      setTimeout(() => {
        history.push('/employees');
      }, 250);
    },
  });

  useEffect(() => {
    if (statusInfo && isUpdate) {
      setNotify({
        isOpen: true,
        message: statusInfo.msg,
        type:
          statusInfo.status === 200 ||
          statusInfo.status === 201 ||
          statusInfo.status === 202 ||
          statusInfo.status === 203 ||
          statusInfo.status === 204
            ? 'success'
            : 'error',
      });
    }
    dispatch(clearIsUpdate(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusInfo]);

  useEffect(() => {
    if (employee) setValues({ id: employeeId, ...employee });
  }, [employeeId, setValues, employee]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getEmployeeByIdSlice(employeeId));
    }, 300);
  }, [dispatch, employeeId]);

  const updateStatusEmployee = (statusHistory: any) => {
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const [confirmDialog, setConfirmDialog] = useState<IConfirmDialog>({
    isOpen: false,
    title: '',
    subTitle: '',
    onConfirm: null,
  });

  const handleShowPopup = () => {
    setConfirmDialog({
      isOpen: true,
      title: t('employees.confirmResetTitle'),
      subTitle: t('employees.confirmSubTitle'),
      onConfirm: () => {
        const data = {
          currentPassword: employee?.password,
          newPassword: password,
        };
        dispatch(
          resetPasswordEmployee({
            id: employeeId,
            data,
          })
        );
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        setTimeout(() => {
          dispatch(getEmployeeByIdSlice(employeeId));
        }, 300);
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <Paper className={classes.pageContent}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="large" />}
            aria-label="breadcrumb"
            className={classes.styleTypo}
          >
            <NavLink className={classes.styleLink} to="/employees">
              <Typography className={classes.styleTypo} component="h2">
                {t('employees.employees')}
              </Typography>
            </NavLink>

            <Typography
              color="textPrimary"
              component="h2"
              className={classes.styleTypo}
            >
              {t('employees.detail')}
            </Typography>
          </Breadcrumbs>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              {isLoading ? (
                <>
                  <Skeleton animation="wave" width="60%" />
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                </>
              ) : (
                <AccountInfomations
                  values={otherValues as IValues}
                  errors={otherErrors as IErrors}
                  touched={otherTouched as ITouched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  disabledEmail
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {isLoading ? (
                <>
                  <Skeleton animation="wave" width="60%" />
                  <Typography component="div" variant="h3">
                    <Skeleton animation="wave" />
                  </Typography>
                  <div
                    className={clsx(
                      classes.styleButtonGroup,
                      classes.buttonGroupResp
                    )}
                  >
                    <Typography
                      component="div"
                      variant="h3"
                      style={{ display: 'inline-block', width: '20%' }}
                    >
                      <Skeleton animation="wave" />
                    </Typography>
                    <Typography
                      component="div"
                      variant="h3"
                      style={{
                        marginLeft: '1rem',
                        display: 'inline-block',
                        width: '20%',
                      }}
                    >
                      <Skeleton animation="wave" />
                    </Typography>
                  </div>
                </>
              ) : (
                <>
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
                      error={
                        (touchedUserName && errorUsername) as string | false
                      }
                      InputProps={{}}
                      disabled
                    />
                  </div>
                  <div
                    className={clsx(
                      classes.styleButtonGroup,
                      classes.buttonGroupResp
                    )}
                  >
                    <Button
                      text={t('employees.resetPass')}
                      className={classes.resetButton}
                      type="button"
                      size="large"
                      color="default"
                      variant="contained"
                      onClick={handleShowPopup}
                      startIcon={null}
                    />
                    <Button
                      text={
                        otherValues.status
                          ? t('employees.deActivated')
                          : t('employees.activated')
                      }
                      color="secondary"
                      type="button"
                      size="large"
                      variant="contained"
                      onClick={() => {
                        setInfoForm({
                          titleForm: t('employees.statusTitleForm'),
                          nameButton: t('employees.update'),
                        });
                        setOpenPopup(true);
                        setRecordForEdit(null);
                      }}
                      startIcon={null}
                      className={otherValues.status ? '' : classes.submitButton}
                    />
                  </div>
                </>
              )}
            </Grid>
          </Grid>
          <div
            className={clsx(classes.styleButtonGroup, classes.buttonGroupResp)}
          >
            {isLoading ? (
              <>
                <Typography
                  component="div"
                  variant="h3"
                  style={{ display: 'inline-block', width: '15%' }}
                >
                  <Skeleton animation="wave" />
                </Typography>
                <Typography
                  component="div"
                  variant="h3"
                  style={{
                    marginLeft: '1rem',
                    display: 'inline-block',
                    width: '15%',
                  }}
                >
                  <Skeleton animation="wave" />
                </Typography>
              </>
            ) : (
              <>
                <Button
                  text={t('employees.update')}
                  className={classes.submitButton}
                  type="submit"
                  size="large"
                  color="default"
                  variant="contained"
                  startIcon={null}
                  onClick={() => {}}
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
              </>
            )}
          </div>
        </Paper>
      </form>
      <Popup
        title={infoForm.titleForm}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <EmployeeForm
          recordForEdit={recordForEdit}
          updateStatusEmployee={updateStatusEmployee}
          nameButton={infoForm.nameButton}
          title={infoForm.titleForm}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};

export default EmployeeDetail;
