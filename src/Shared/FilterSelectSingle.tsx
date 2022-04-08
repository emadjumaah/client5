/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import OptionFilterItem from './OptionFilterItem';

export default function FilterSelectSingle({
  options,
  value,
  setValue,
  words,
  isRTL,
  name,
  width,
}: any) {
  return (
    <Autocomplete
      size="small"
      options={options}
      getOptionLabel={(option: any) => (isRTL ? option.nameAr : option.name)}
      getOptionSelected={(option, values) => option.id === values.id}
      renderOption={(option) => (
        <OptionFilterItem isRTL={isRTL} item={option}></OptionFilterItem>
      )}
      value={value}
      onChange={(_, newValue: any) => {
        setValue(newValue);
      }}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      renderInput={(params) => (
        <TextField
          {...params}
          id={name}
          name={name}
          label={words[name]}
          variant="outlined"
          style={{
            width: width ? width : 180,
            marginRight: 10,
            marginLeft: 10,
            backgroundColor: value ? '#FFF5D6' : undefined,
            fontSize: 10,
          }}
        ></TextField>
      )}
    />
  );
}
