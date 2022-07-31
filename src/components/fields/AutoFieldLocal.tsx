import React from 'react';
import { IconButton, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import OptionItem from '../../Shared/OptionItem';
import { Grid } from '@material-ui/core';
import OptionItemData from '../../Shared/OptionItemData';
import _ from 'lodash';
import ListboxComponent from './ListboxComponent';

export default function AutoFieldLocal({
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
  ms,
  openOnFocus,
  classes,
  basename,
  resetRelated,
  disabled,
  isRTL,
  setPricevalue,
  mb,
  day,
  width,
  showphone,
  nosort,
  onNewFieldChange,
}: any) {
  let sorted = options;
  if (!nosort) {
    sorted = _.sortBy(options, isRTL ? 'nameAr' : 'name');
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={openAdd ? 11 : 12}>
        <Autocomplete
          openOnFocus={openOnFocus}
          autoSelect
          ListboxComponent={ListboxComponent}
          options={sorted}
          getOptionLabel={(option: any) => {
            let nm;
            if (basename) {
              nm = isRTL ? option?.[`${basename}Ar`] : option?.[basename];
            } else if (option.title && !option.name) {
              nm = option?.title;
            } else {
              nm = isRTL ? option?.nameAr : option?.name;
            }
            const phone = option?.phone ? option?.phone : '';
            const code = option?.code;
            if (phone && showphone) {
              return `${nm} - ${phone}`;
            } else if (code) {
              return `${nm} - ${code}`;
            } else {
              return nm ? nm : '';
            }
          }}
          getOptionSelected={(option, values) => option?._id === values?._id}
          renderOption={(option) => {
            if (name === 'item') {
              return (
                <OptionItemData isRTL={isRTL} item={option}></OptionItemData>
              );
            } else {
              return (
                <OptionItem
                  day={day}
                  isRTL={isRTL}
                  item={option}
                  basename={basename}
                  showphone={showphone}
                ></OptionItem>
              );
            }
          }}
          value={value}
          disabled={disabled}
          onChange={(_, newValue: any) => {
            setSelectValue(newValue);
            if (onNewFieldChange) {
              onNewFieldChange(newValue?.id, name);
            }
            if (setSelectError) {
              setSelectError(false);
            }
            if (resetRelated) {
              resetRelated(null);
            }
            if (setPricevalue) {
              setPricevalue(newValue?.price);
            }
          }}
          style={{
            marginInlineStart: ms ? ms : undefined,
            width: width ? width : undefined,
            direction: isRTL ? 'rtl' : 'ltr',
          }}
          // classes={classes}
          classes={classes ? { input: classes.smallFont } : undefined}
          renderInput={(params) => (
            <TextField
              {...params}
              id={name}
              name={name}
              label={title}
              variant="outlined"
              error={selectError}
              style={{ marginBottom: mb }}
              fullWidth
              inputRef={(ref) => {
                if (refernce) {
                  refernce.current = ref;
                  if (register) {
                    register(ref);
                  }
                }
              }}
            ></TextField>
          )}
        />
      </Grid>
      {openAdd && !disabled && (
        <Grid item xs={1}>
          <IconButton
            disableFocusRipple
            onClick={() => {
              openAdd();
            }}
            style={{
              backgroundColor: '#f4f4f4',
              width: 30,
              height: 30,
              position: 'relative',
              top: 12,
              left: isRTL ? 16 : undefined,
              right: isRTL ? undefined : 16,
            }}
          >
            <AddIcon style={{ color: '#aaa' }}></AddIcon>
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}
