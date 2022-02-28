import { Grid, makeStyles, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Input from '../../../../../../components/controls/Input';
import Button from '../../../../../../components/controls/Button';
import ConfirmDialog from '../../../../../../components/ConfirmDialog/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks';
import {
  getEmployeeByIdSlice,
  getStatusInfoEmployee,
  selectEmployees,
  updateStatusInfoEmployee,
} from '../../employeesSlice';
import TimePicker from '../../../../../../components/controls/TimePicker';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiFormControl-root': {
      width: '80%',
      margin: theme.spacing(1),
    },
  },
  styleDate: {
    fontSize: '1.5rem',
    paddingTop: '0.5rem',
  },
  elementSpace: {
    marginTop: theme.spacing(2),
  },
  styleControls: {
    minWidth: '100%',
    marginBottom: '1rem',
  },
}));

const validationSchema = yup.object().shape({});

export interface IConfirmDialog {
  isOpen: boolean;
  title: string;
  subTitle: string;
  onConfirm: null | (() => void);
}

export interface IStatusInfo {
  joinedDate: any;
  createdAt: any;
  name: string | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
}

export default function EmployeeForm(props: any) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setOpenPopup, nameButton } = props;

  const { employeeId } = useParams<{ employeeId: string }>();

  const { statusInfoEmployee } = useAppSelector(selectEmployees);

  const dispatch = useAppDispatch();

  const [confirmDialog, setConfirmDialog] = useState<IConfirmDialog>({
    isOpen: false,
    title: '',
    subTitle: '',
    onConfirm: null,
  });

  useEffect(() => {
    dispatch(getStatusInfoEmployee(employeeId));
  }, [dispatch, employeeId]);

  const initialValues: IStatusInfo = {
    joinedDate: new Date(),
    createdAt: new Date(),
    name: '',
    phoneNumber: '',
    email: '',
  };

  const { values, handleSubmit, handleChange, setValues } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (data: IStatusInfo) => {
      setConfirmDialog({
        isOpen: true,
        title: t('employees.confirmTitle'),
        subTitle: t('employees.confirmSubTitle'),
        onConfirm: () => {
          dispatch(
            updateStatusInfoEmployee({
              id: employeeId,
              data: { createdDate: data.joinedDate },
            })
          );
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          setOpenPopup(false);
          setTimeout(() => {
            dispatch(getEmployeeByIdSlice(employeeId));
          }, 200);
        },
      });
    },
  });

  useEffect(() => {
    const getValues = {
      joinedDate: statusInfoEmployee?.joinedDate,
      createdAt: statusInfoEmployee?.createdAt,
      name: statusInfoEmployee?.author
        ? `${statusInfoEmployee?.author.lastName} ${statusInfoEmployee?.author.firstName}`
        : '',
      email: statusInfoEmployee?.author ? statusInfoEmployee?.author.email : '',
      phoneNumber: statusInfoEmployee?.author
        ? statusInfoEmployee?.author.phoneNumber
        : '',
    };
    setValues(getValues);
  }, [
    setValues,
    statusInfoEmployee,
    statusInfoEmployee?.joinedDate,
    statusInfoEmployee?.createdAt,
  ]);

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.root}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className="">
              {t('employees.previousAccountInfo')}
            </Typography>
            {statusInfoEmployee?.statusCretead ? (
              <>
                <Input
                  name="name"
                  label={t('employees.name')}
                  value={values.name}
                  disabled
                  error=""
                  onChange={() => {}}
                  onBlur={() => {}}
                  type="text"
                  InputProps={{}}
                  className={classes.elementSpace}
                />
                <Input
                  name="email"
                  label={t('employees.email')}
                  value={values.email}
                  disabled
                  error=""
                  onChange={() => {}}
                  onBlur={() => {}}
                  type="text"
                  InputProps={{}}
                  className={classes.elementSpace}
                />
                <Input
                  name="phoneNumber"
                  label={t('employees.phone')}
                  value={values.phoneNumber}
                  disabled
                  error=""
                  onChange={() => {}}
                  onBlur={() => {}}
                  type="text"
                  InputProps={{}}
                  className={classes.elementSpace}
                />
              </>
            ) : (
              <Typography className={classes.elementSpace}>
                {t('employees.noPersonAction')}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" className="">
              {t('employees.actionHistory')}
            </Typography>
            <TimePicker
              className={classes.elementSpace}
              name="joinedDate"
              label={t('employees.joinedDate')}
              onChange={handleChange}
              value={values.joinedDate}
              error=""
              isDisabled={statusInfoEmployee?.statusCretead as boolean}
              isStatusForm
            />

            {statusInfoEmployee?.statusCretead ? (
              <TimePicker
                className={classes.elementSpace}
                name="createdAt"
                label={t('employees.updatedDate')}
                onChange={handleChange}
                value={values.createdAt}
                error=""
                isDisabled
                isStatusForm
              />
            ) : (
              ''
            )}

            <div className={classes.elementSpace}>
              <Button
                text={nameButton}
                className=""
                type="submit"
                size="large"
                color="primary"
                variant="contained"
                startIcon={null}
                onClick={() => {}}
              />
            </div>
          </Grid>
        </Grid>
      </form>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
