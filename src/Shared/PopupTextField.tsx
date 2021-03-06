/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { TextField } from '@material-ui/core';
import _ from 'lodash';

export default function PopupTextField({
  register,
  errors,
  name,
  label,
  row,
  required = false,
  autoFocus = false,
  newtext,
  margin,
  ltr,
  autoComplete = 'off',
  ...res
}: any) {
  return (
    <TextField
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      required={required}
      name={name}
      fullWidth
      // onChange={_.debounce((e: any) => console.log(e.target.value), 300)}
      defaultValue={row?.[name] || newtext || ''}
      label={label}
      error={errors[name] ? true : false}
      inputRef={register}
      variant="outlined"
      style={{
        margin: margin ? margin : undefined,
        direction: ltr ? 'ltr' : undefined,
      }}
      margin="dense"
      {...res}
    />
  );
}
