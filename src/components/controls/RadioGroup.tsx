import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { ChangeEvent, ReactNode } from 'react';

interface Item {
  value: number | boolean;
  label: string;
}

interface IRadioGroup {
  name: string | undefined;
  label: ReactNode;
  value: boolean | number;
  onChange:
    | ((event: ChangeEvent<HTMLInputElement>, value: string) => void)
    | undefined;
  items: Item[];
  disabled: boolean | undefined;
}

export default function RadioGroup({
  name,
  label,
  value,
  onChange,
  items,
  disabled,
}: any) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <MuiRadioGroup row name={name} value={value} onChange={onChange}>
        {items.map((item: any, indx: any) => {
          return (
            <FormControlLabel
              key={item.id}
              value={item.id}
              control={<Radio />}
              label={item.title}
              disabled={disabled}
            />
          );
        })}
      </MuiRadioGroup>
    </FormControl>
  );
}
