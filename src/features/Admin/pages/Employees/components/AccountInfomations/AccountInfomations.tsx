import { makeStyles, Typography } from '@material-ui/core';
import { ChangeEvent, FocusEvent } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../../../../components/controls/DatePicker';
import Input from '../../../../../../components/controls/Input';
import Select from '../../../../../../components/controls/Select';
import district from '../../../../../../constants/district';
import provinceOrCity from '../../../../../../constants/province-city';
import { ISelectFormat } from '../../Employees';

const useStyles = makeStyles(theme => ({
  styleControls: {
    minWidth: '100%',
    marginBottom: '1rem',
  },
  styleHeader: {
    marginBottom: '1rem',
  },
}));

export interface IValues {
  firstName: string;
  lastName: string;
  birthDay: Date | string;
  email: string;
  status: boolean;
  gender: number;
  phoneNumber: string;
  province: number | string;
  district: number | string;
}

export interface ITouched {
  firstName: boolean;
  lastName: boolean;
  birthDay: boolean | Date;
  email: boolean;
  phoneNumber: boolean;
  status: boolean;
  gender: boolean;
  province: boolean;
  district: boolean;
}

export interface IErrors {
  firstName: string;
  lastName: string;
  birthDay: string | boolean | Date;
  email: string;
  phoneNumber: string;
  status: string;
  gender: string;
  province: string;
  district: string;
}

interface IHandleBlur {
  (e: FocusEvent<any>): void;
  <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
}

interface IHandleChange {
  (e: ChangeEvent<any>): void;
  <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends ChangeEvent<any>
    ? void
    : (e: string | ChangeEvent<any>) => void;
}

interface IAccountInfomations {
  values: IValues;
  errors: IErrors;
  touched: ITouched;
  handleChange: IHandleChange;
  handleBlur: IHandleBlur;
  disabledEmail: boolean;
}

const AccountInfomations = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  disabledEmail,
}: IAccountInfomations) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const GENDER_LIST: ISelectFormat[] = [
    { value: 0, label: t('employees.male') },
    { value: 1, label: t('employees.female') },
    { value: 2, label: t('employees.others') },
  ];

  const PROVINCE: ISelectFormat[] = [
    { value: 0, label: t('employees.selectProvince') },
  ];

  Object.keys(provinceOrCity).forEach(key => {
    PROVINCE.push({
      value: Number(key),
      label: provinceOrCity[key].name,
    });
  });

  const DISTRICT: ISelectFormat[] = [
    {
      value: 0,
      label: t('employees.selectDistrict'),
    },
  ];

  Object.keys(district).forEach(key => {
    if (Number(values.province) === Number(district[key].parent_code)) {
      DISTRICT.push({
        value: Number(key),
        label: district[key].name,
      });
    }
  });

  const temp = DISTRICT.some(item => item.value === values.district);

  return (
    <>
      <Typography className={classes.styleHeader} variant="h6">
        {t('employees.accountInfo')}
      </Typography>
      <div>
        <Input
          className={classes.styleControls}
          type="text"
          name="firstName"
          label={`${t('employees.firstName')}*`}
          onBlur={handleBlur}
          onChange={handleChange}
          value={(touched.firstName && values.firstName) || values.firstName}
          error={touched.firstName && errors.firstName}
          InputProps={{}}
          disabled={false}
        />
      </div>

      <div>
        <Input
          className={classes.styleControls}
          name="lastName"
          type="text"
          label={`${t('employees.lastName')}*`}
          onBlur={handleBlur}
          onChange={handleChange}
          value={(touched.lastName && values.lastName) || values.lastName}
          error={touched.lastName && errors.lastName}
          InputProps={{}}
          disabled={false}
        />
      </div>
      <div>
        <Select
          className=""
          name="gender"
          label={t('employees.gender')}
          onChange={handleChange}
          value={values.gender}
          options={GENDER_LIST}
          error={undefined}
        />
      </div>
      <div>
        <DatePicker
          className={classes.styleControls}
          name="birthDay"
          label={t('employees.birthday')}
          onChange={handleChange}
          value={values.birthDay}
          error={errors.birthDay}
          isDisabled={false}
          isStatusForm={false}
        />
      </div>
      <div>
        <Input
          className={classes.styleControls}
          name="email"
          type="text"
          label={`${t('employees.email')}*`}
          onBlur={handleBlur}
          onChange={handleChange}
          value={(touched.email && values.email) || values.email}
          error={touched.email && errors.email}
          InputProps={{}}
          disabled={disabledEmail}
        />
      </div>
      <div>
        <Input
          className={classes.styleControls}
          name="phoneNumber"
          type="text"
          label={`${t('employees.phone')}*`}
          onBlur={handleBlur}
          onChange={handleChange}
          value={
            (touched.phoneNumber && values.phoneNumber) || values.phoneNumber
          }
          error={touched.phoneNumber && errors.phoneNumber}
          InputProps={{}}
          disabled={disabledEmail}
        />
      </div>
      <div>
        <Select
          className=""
          name="province"
          label={t('employees.province')}
          onChange={handleChange}
          value={values.province}
          options={PROVINCE}
          error={undefined}
        />
      </div>
      <div>
        <Select
          className=""
          name="district"
          label={t('employees.district')}
          onChange={handleChange}
          value={temp ? values.district : 0}
          options={DISTRICT}
          error={undefined}
        />
      </div>
    </>
  );
};

export default AccountInfomations;
