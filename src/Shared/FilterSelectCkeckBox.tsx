/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Checkbox, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function FilterSelect({
  options,
  value,
  setValue,
  words,
  isRTL,
  name,
  width,
  nomulti = false,
}: any) {
  return (
    <Autocomplete
      size="small"
      multiple={!nomulti}
      options={options}
      disableCloseOnSelect
      disableListWrap
      fullWidth
      getOptionLabel={(option: any) => (isRTL ? option.nameAr : option.name)}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      renderOption={(option, { selected }) => (
        <Box
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: isRTL ? 'flex-end' : 'flex-start',
          }}
        >
          {!nomulti && (
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
          )}
          {isRTL ? option.nameAr : option.name}
        </Box>
      )}
      value={value}
      onChange={(_, newValue: any) => {
        setValue(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          rows={1}
          rowsMax={1}
          id={name}
          name={name}
          label={words[name]}
          variant="outlined"
          style={{
            width: width ? width : 200,
            marginRight: 5,
            marginLeft: 5,
            backgroundColor: value?.length > 0 ? '#FFF5D6' : undefined,
            fontSize: 10,
            margin: 0,
            padding: 0,
            direction: isRTL ? 'rtl' : 'ltr',
          }}
        ></TextField>
      )}
    />
  );
}
