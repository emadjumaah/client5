import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  })
);

const getFormatedDate = (value) => {
  var now = value ? new Date(value) : new Date();
  var offset = now.getTimezoneOffset() * 60000;
  var adjustedDate = new Date(now.getTime() - offset);
  var formattedDate = adjustedDate.toISOString().substring(0, 16);
  return formattedDate;
};

export default function CalenderDateTime({ label, value, onChange, time }) {
  const classes = useStyles();
  const type = time ? 'datetime-local' : 'date';
  const rValue = getFormatedDate(value);
  return (
    <form className={classes.container} noValidate>
      <TextField
        id="datetime"
        label={label}
        type={type}
        value={rValue}
        onChange={(e) => onChange(e.target.value)}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
}
