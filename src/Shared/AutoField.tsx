/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import OptionItem from './OptionItem';

export default function AutoField({
  words,
  name,
  options,
  value,
  setSelectValue,
  setSelectError,
  selectError,
  refernce,
  register,
  openAdd,
  title,
  width = 294,
  phone = false,
  nolabel = false,
  noPlus = false,
  ms,
  openOnFocus,
  classes,
  basename,
  resetRelated,
  disabled,
  margin,
  isRTL,
}: // fontsize = 16,
any) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: margin ? margin : undefined,
        // marginTop: 15,
      }}
    >
      {!nolabel && (
        <Box
          style={{
            display: 'flex',
            width: 100,
            alignItems: 'center',
            height: 40,
            padding: 10,
          }}
        >
          <Typography>{title}</Typography>
        </Box>
      )}
      <Autocomplete
        openOnFocus={openOnFocus}
        autoSelect
        options={options}
        getOptionLabel={(option: any) =>
          option?.[basename]
            ? option[basename]
            : isRTL
            ? option?.nameAr
            : option?.name
            ? option.name
            : ''
        }
        getOptionSelected={(option, values) => option._id === values._id}
        renderOption={(option) => (
          <OptionItem
            isRTL={isRTL}
            item={option}
            basename={basename}
          ></OptionItem>
        )}
        value={value}
        disabled={disabled}
        onChange={(_, newValue: any) => {
          setSelectValue(newValue);
          setSelectError(false);
          if (resetRelated) {
            resetRelated(null);
          }
        }}
        style={{
          marginInlineStart: ms ? ms : undefined,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
        classes={classes ? { input: classes.smallFont } : undefined}
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            name={name}
            label={nolabel ? title : undefined}
            variant="outlined"
            error={selectError}
            style={{ width }}
            InputLabelProps={{
              style: { fontSize: 13 },
            }}
            inputRef={(ref) => {
              refernce.current = ref;
              register(ref);
            }}
          ></TextField>
        )}
      />
      {phone && (
        <Autocomplete
          autoSelect
          options={options}
          openOnFocus={openOnFocus}
          getOptionLabel={(option: any) => option.phone}
          getOptionSelected={(option, values) => option._id === values._id}
          renderOption={(option) => (
            <OptionItem phone item={option}></OptionItem>
          )}
          value={value}
          onChange={(_, newValue: any) => {
            setSelectValue(newValue);
            setSelectError(false);
          }}
          style={{ marginInlineStart: 30, direction: isRTL ? 'rtl' : 'ltr' }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="phone"
              name="phone"
              variant="outlined"
              label={nolabel ? words.phoneNumber : undefined}
              error={selectError}
              style={{ width: 250 }}
              InputLabelProps={{
                style: { fontSize: isRTL ? 16 : 13 },
              }}
            ></TextField>
          )}
        />
      )}
      {!noPlus && (
        <IconButton
          disableFocusRipple
          onClick={() => {
            if (openAdd) openAdd();
          }}
        >
          <AddIcon></AddIcon>
        </IconButton>
      )}
    </Box>
  );
}
