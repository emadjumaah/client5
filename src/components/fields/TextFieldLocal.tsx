/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { TextField } from '@material-ui/core';
import _ from 'lodash';

export default function TextFieldLocal({
  register,
  errors,
  name,
  label,
  row,
  required = false,
  autoFocus = false,
  width,
  newtext,
  margin,
  fullWidth,
  mb = 20,
  ...res
}: any) {
  return (
    <TextField
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      autoComplete="off"
      required={required}
      name={name}
      // onChange={_.debounce((e: any) => console.log(e.target.value), 300)}
      defaultValue={row?.[name] || newtext || ''}
      label={label}
      error={errors ? (errors[name] ? true : false) : false}
      inputRef={register}
      variant="outlined"
      style={{ width, marginBottom: mb }}
      margin="dense"
      {...res}
    />
  );
}
