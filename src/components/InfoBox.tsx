import { useHistory } from 'react-router-dom';
import { makeStyles, Paper } from '@material-ui/core';
// import { Skeleton } from '@material-ui/lab';

export default function InfoBox(props: any) {
  const { Icon, color, textTitle, numberTitle, path, isLoading } = props;

  const useStyles = makeStyles(theme => ({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'right',
      color: theme.palette.text.secondary,
      text: 'left',
      borderRadius: '3px',
      width: '250px',
      height: '120px',
      margin: '20px 20px',
      boxShadow:
        ' 0 2.8px 2.2px rgb(0 0 0 / 3%), 0 6.7px 5.3px rgb(0 0 0 / 5%), 0 12.5px 10px rgb(0 0 0 / 6%), 0 22.3px 17.9px rgb(0 0 0 / 7%), 0 41.8px 33.4px rgb(0 0 0 / 9%), 0 100px 80px rgb(0 0 0 / 12%)',
    },
    number: {
      fontSize: '2rem',
      color: 'black',
    },
    icon: {
      backgroundColor: color,
      color: 'white',
      padding: '3px',
      marginTop: '-30px',
      fontSize: '4.5rem',
      boxShadow:
        '0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(255 152 0 / 40%)',
      borderRadius: '3px',
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      float: 'left',
    },
    text: {
      padding: '2px 0px',
    },
  }));

  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper
      className={classes.paper}
      onClick={() => {
        history.push(path);
      }}
    >
      <div>
        <div className={classes.title}>
          <Icon className={classes.icon} />
        </div>
        <div className={classes.text}>{textTitle}</div>
        <div className={classes.number}>{numberTitle}</div>
      </div>
    </Paper>
  );
}
