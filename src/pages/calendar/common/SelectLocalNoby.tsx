/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FormControl, MenuItem, Select } from '@material-ui/core';
import React from 'react';

export const SelectLocalNoby = ({
  options,
  value,
  onChange,
  isRTL,
  width = 180,
  disabled = false,
}: any) => {
  return (
    <FormControl>
      <Select
        id="simple-menu"
        value={value}
        disabled={disabled}
        onChange={onChange}
        variant="outlined"
        style={{
          height: 38,
          width: width,
          alignSelf: 'flex-end',
          fontWeight: 'bold',
          color: '#555',
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
