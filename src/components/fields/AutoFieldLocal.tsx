/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import OptionItem from "../../Shared/OptionItem";
import { Grid } from "@material-ui/core";
import OptionItemData from "../../Shared/OptionItemData";

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
}: any) {
  return (
    <Grid container spacing={0}>
      <Grid item xs={openAdd ? 11 : 12}>
        <Autocomplete
          openOnFocus={openOnFocus}
          autoSelect
          fullWidth
          options={options}
          getOptionLabel={(option: any) => {
            let nm;
            if (basename) {
              nm = isRTL ? option?.[`${basename}Ar`] : option?.[basename];
            } else if (option.title && !option.name) {
              nm = option?.title;
            } else {
              nm = isRTL ? option?.nameAr : option?.name;
            }
            const phone = option?.phone ? option?.phone : "";
            if (phone && showphone) {
              return `${nm} - ${phone}`;
            } else {
              return nm ? nm : "";
            }
          }}
          getOptionSelected={(option, values) => option._id === values._id}
          renderOption={(option) => {
            if (name === "item") {
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
            direction: isRTL ? "rtl" : "ltr",
          }}
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
      {openAdd && (
        <Grid item xs={1}>
          <IconButton
            disableFocusRipple
            onClick={() => {
              openAdd();
            }}
            style={{ width: 30, height: 30, marginTop: 15 }}
          >
            <AddIcon style={{ color: "#aaa" }}></AddIcon>
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}
