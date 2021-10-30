/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Checkbox, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useTemplate } from '../hooks';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function FilterSelectMulti({
  options,
  value,
  setValue,
  words,
  isRTL,
  name,
  width,
  nomulti = false,
}: any) {
  const { tempwords } = useTemplate();
  return (
    <Autocomplete
      size="small"
      multiple={!nomulti}
      options={options}
      disableCloseOnSelect
      disableListWrap
      limitTags={3}
      getOptionLabel={(option: any) => (isRTL ? option.nameAr : option.name)}
      style={{ padding: 10 }}
      renderOption={(option, { selected }) => (
        <Box
          style={{
            direction: isRTL ? 'rtl' : 'ltr',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
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
          label={tempwords?.[name] ? tempwords?.[name] : words?.[name]}
          variant="outlined"
          style={{
            fontWeight: 'bold',
            width: width ? width : 200,
            marginRight: 5,
            marginLeft: 5,
            backgroundColor: value?.length > 0 ? '#FFF5D6' : undefined,
            fontSize: 10,
            margin: 0,
            padding: 0,
          }}
        ></TextField>
      )}
    />
  );
}
