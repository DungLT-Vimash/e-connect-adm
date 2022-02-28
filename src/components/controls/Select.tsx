import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@material-ui/core';
import { ChangeEvent, createRef, ReactNode } from 'react';

interface Option {
  value: number | string;
  label: string;
}

interface ISelect {
  name: string;
  label: string;
  value: number | string;
  error: string | undefined;
  onChange: (
    event: ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: ReactNode
  ) => void;
  options: Option[];
  className: string;
}

export default function Select({
  name,
  label,
  value,
  error,
  onChange,
  options,
  className,
}: ISelect) {
  const ref = createRef();

  return (
    <FormControl
      fullWidth
      style={{ marginBottom: '1rem' }}
      variant="outlined"
      className={className}
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        ref={ref}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((item: any) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
