import { OutlinedInputProps, TextField } from '@material-ui/core';
import { ChangeEventHandler, FocusEventHandler } from 'react';

export interface IInput {
  name: string;
  label: string;
  value: string | undefined;
  error: string | false;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled: boolean;
  type: string;
  className: string;
  InputProps: Partial<OutlinedInputProps>;
}

export default function Input(props: IInput) {
  const {
    name,
    label,
    value,
    error,
    onChange,
    onBlur,
    disabled,
    type,
    className,
    InputProps,
  } = props;
  return (
    <TextField
      fullWidth
      type={type || 'text'}
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      disabled={disabled}
      className={className}
      InputProps={InputProps}
      {...(error && { error: true, helperText: error })}
    />
  );
}
