/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Checkbox, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useTemplate } from '../hooks';
import ListboxComponent from '../components/fields/ListboxComponent';

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
  label,
}: any) {
  const { tempwords } = useTemplate();
  return (
    <Autocomplete
      size="small"
      multiple={!nomulti}
      options={options}
      disableCloseOnSelect
      ListboxComponent={ListboxComponent}
      disableListWrap
      limitTags={3}
      getOptionLabel={(option: any) => (isRTL ? option.nameAr : option.name)}
      style={{ direction: isRTL ? 'rtl' : 'ltr', padding: 10 }}
      renderOption={(option, { selected }) => (
        <Box
          style={{
            display: 'flex',
            flex: 1,
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
            }}
          >
            {!nomulti && (
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: -8 }}
                checked={selected}
              />
            )}
            <Typography variant="body2">
              {isRTL ? option.nameAr : option.name}
            </Typography>
          </Box>
          {option.code && (
            <Typography variant="body2">{option.code}</Typography>
          )}
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
          label={
            label
              ? label
              : tempwords?.[name]
              ? tempwords?.[name]
              : words?.[name]
          }
          variant="outlined"
          style={{
            fontWeight: 'bold',
            width,
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
