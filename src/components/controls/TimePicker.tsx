import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

interface IDatePicker {
  name: string;
  label: string;
  value: Date | string | undefined;
  onChange: any;
  error: string | boolean | Date | undefined;
  className: string;
  isDisabled: boolean;
  isStatusForm: boolean;
}

export default function TimePicker({
  name: nameDate,
  label,
  value: valueDate,
  onChange,
  error,
  className,
  isDisabled,
  isStatusForm,
}: IDatePicker) {
  const convertToDefEventPara = (
    name: string,
    value: Date | string | undefined | null
  ) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        label={label}
        format={isStatusForm ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
        name={nameDate}
        value={valueDate}
        onChange={date => onChange(convertToDefEventPara(nameDate, date))}
        className={className}
        disabled={isDisabled}
        {...(error && { error: true, helperText: error })}
      />
    </MuiPickersUtilsProvider>
  );
}
