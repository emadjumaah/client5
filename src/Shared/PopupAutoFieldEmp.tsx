/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Autocomplete } from '@material-ui/lab';
import OptionItem from './OptionItem';
import { weekdaysNNo } from '../constants/datatypes';

export default function PopupAutoFieldEmp({
  name,
  title,
  options,
  value,
  onNewFieldChange,
  open,
  appointmentData,
  isRTL,
  canAdd,
}: any) {
  const defaultColor = '#fff';
  const [color, setcolor] = useState(defaultColor);
  const isColor = color !== defaultColor;

  useEffect(() => {
    if (value && value.color) setcolor(value.color);
  }, [value]);

  const date = appointmentData?.startDate
    ? new Date(appointmentData?.startDate)
    : new Date();
  const day = weekdaysNNo?.[date.getDay()];

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
          <OptionItem day={day} isRTL={isRTL} item={option}></OptionItem>
        )}
        value={value}
        onChange={(_, newValue: any) => {
          onNewFieldChange(newValue, name);
          setcolor(newValue?.color ? newValue.color : '#fff');
        }}
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
