/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FormControl, MenuItem, Select } from '@material-ui/core';
import React from 'react';

export const SelectLocal = ({
  options,
  value,
  onChange,
  isRTL,
  width = 150,
  disabled = false,
  fullWidth,
}: any) => {
  return (
    <FormControl>
      <Select
        id="simple-menu"
        value={value}
        disabled={disabled}
        onChange={onChange}
        variant="outlined"
        fullWidth={fullWidth}
        style={{
          height: 38,
          width: fullWidth ? undefined : width,
          alignSelf: 'flex-end',
          fontSize: 14,
          fontWeight: 'bold',
          color: disabled ? '#bbb' : '#555',
        }}
      >
        {options.map((item: any) => {
          return (
            <MenuItem
              key={item.id}
              style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}
              value={item.value}
            >
              {isRTL ? item.nameAr : item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
