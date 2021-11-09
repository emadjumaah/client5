/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Autocomplete } from '@material-ui/lab';
import OptionItem from './OptionItem';

export default function PopupAutoField({
  name,
  title,
  options,
  value,
  onNewFieldChange,
  open,
  isRTL,
  canAdd,
}: any) {
  const defaultColor = '#fff';
  const [color, setcolor] = useState(defaultColor);
  const isColor = color !== defaultColor;

  useEffect(() => {
    if (value && value.color) setcolor(value.color);
  }, [value]);

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box
        style={{
          display: 'flex',
          width: 100,
          alignItems: 'center',
          height: 40,
          padding: 10,
          marginBottom: 25,
        }}
      >
        <Typography>{title}</Typography>
      </Box>
      <Autocomplete
        autoSelect
        options={options}
        getOptionLabel={(option: any) => (isRTL ? option.nameAr : option.name)}
        getOptionSelected={(option, values) => option._id === values._id}
        renderOption={(option) => (
          <OptionItem isRTL={isRTL} item={option}></OptionItem>
        )}
        value={value}
        onChange={(_, newValue: any) => {
          onNewFieldChange(newValue, name);
          setcolor(newValue?.color ? newValue.color : '#fff');
        }}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        renderInput={(params) => (
          <React.Fragment>
            <TextField
              {...params}
              id={name}
              name={name}
              variant="outlined"
              style={{
                width: 410,
                paddingLeft: !isRTL ? (isColor ? 35 : undefined) : undefined,
                paddingRight: isRTL ? (isColor ? 35 : undefined) : undefined,
              }}
              // onChange={(e: any) => setNewtext(e.target.value)}
            ></TextField>
            <Box
              style={{
                position: 'relative',
                bottom: 40,
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: isColor ? color : undefined,
              }}
            ></Box>
          </React.Fragment>
        )}
      />
      {canAdd && (
        <Box style={{ marginBottom: 26 }}>
          <IconButton disableFocusRipple onClick={open}>
            <AddIcon></AddIcon>
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
