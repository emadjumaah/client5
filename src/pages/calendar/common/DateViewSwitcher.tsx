/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { Box, FormControl, MenuItem, Select } from "@material-ui/core";
import { daySwitchClasses } from "../../../themes/classes";

export const DateViewSwitcher = ({
  currentViewName,
  onChange,
  isRTL,
  words,
  views,
  currentDateChange,
}: any) => {
  const classes = daySwitchClasses();

  return (
    <Box
      display="flex"
      style={{
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <FormControl className={classes.formControl}>
        <Select
          id="simple-menu"
          value={currentViewName}
          onChange={(value: any) => {
            onChange(value);
            currentDateChange(new Date());
          }}
          variant="outlined"
          style={{
            height: 34,
            fontSize: 12,
            fontWeight: "bold",
            color: "#555",
          }}
        >
          {views && views.includes(1) && (
            <MenuItem
              style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
              value="Day"
            >
              {words.day}
            </MenuItem>
          )}
          {views && views.includes(3) && (
            <MenuItem
              style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
              value="3Days"
            >
              {words.tdays}
            </MenuItem>
          )}
          {views && views.includes(7) && (
            <MenuItem
              style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
              value="Week"
            >
              {words.week}
            </MenuItem>
          )}
          {views && views.includes(30) && (
            <MenuItem
              style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
              value="Month"
            >
              {words.month}
            </MenuItem>
          )}
          {views && views.includes(365) && (
            <MenuItem
              style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
              value="Year"
            >
              {words.year}
            </MenuItem>
          )}

          {views && views.includes(1000) && (
            <MenuItem
              style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
              value="Custom"
            >
              {isRTL ? "مخصص" : "Custom Date"}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};
