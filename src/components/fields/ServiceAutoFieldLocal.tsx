/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Autocomplete } from '@material-ui/lab';
import OptionItemData from '../../Shared/OptionItemData';

export default function ServiceAutoFieldLocal({
  name,
  title,
  options,
  value,
  defaultValue,
  onNewFieldChange,
  setPricevalue,
  open,
  isRTL,
}: any) {
  return (
    <Box>
      <Box
        style={{
          display: 'flex',
          width: 120,
          alignItems: 'center',
          height: 40,
          padding: 10,
        }}
      >
        <Typography>{title}</Typography>
      </Box>

      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: -15,
        }}
      >
        <Autocomplete
          autoSelect
          options={options}
          getOptionLabel={(option: any) =>
            isRTL ? option.nameAr : option.name
          }
          getOptionSelected={(option, values) => option._id === values._id}
          renderOption={(option) => (
            <OptionItemData isRTL={isRTL} item={option}></OptionItemData>
          )}
          value={value}
          defaultValue={defaultValue}
          onChange={(_, newValue: any) => {
            onNewFieldChange(newValue, name);
            if (setPricevalue) {
              setPricevalue(newValue?.price);
            } else {
              onNewFieldChange(newValue?.price, 'amount');
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              id={name}
              name={name}
              variant="outlined"
              style={{ width: 350 }}
            ></TextField>
          )}
        />

        <IconButton disableFocusRipple onClick={open}>
          <AddIcon></AddIcon>
        </IconButton>
      </Box>
    </Box>
  );
}
