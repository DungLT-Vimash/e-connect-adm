import { Button as MuiButton, makeStyles } from '@material-ui/core';
import { MouseEventHandler, ReactNode } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0.5),
  },
  label: {
    textTransform: 'none',
  },
}));

interface IProps {
  text: string;
  size: 'medium' | 'large' | 'small';
  color: 'inherit' | 'default' | 'primary' | 'secondary';
  variant: 'text' | 'outlined' | 'contained';
  startIcon: ReactNode | null;
  className: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type: 'button' | 'reset' | 'submit';
}

function Button({
  text,
  size,
  color,
  variant,
  onClick,
  type,
  className,
  startIcon,
}: IProps) {
  const classes = useStyles();
  return (
    <MuiButton
      type={type}
      size={size}
      color={color}
      variant={variant}
      className={className as string}
      startIcon={startIcon}
      onClick={onClick}
    >
      {text}
    </MuiButton>
  );
}

export default Button;
