/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { Box, FormControl, MenuItem, Select } from "@material-ui/core";
import { daySwitchClasses } from "../../../themes/classes";

export const ExternalViewSwitcher = ({
  currentViewName,
  onChange,
  isRTL,
  words,
}: any) => {
  const classes = daySwitchClasses();

  return (
    <Box
      display="flex"
      style={{
        position: "absolute",
        right: isRTL ? undefined : 20,
        left: isRTL ? 20 : undefined,
        top: isRTL ? 90 : 90,
        zIndex: 10,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <FormControl className={classes.formControl}>
        <Select
          id="simple-menu"
          value={currentViewName}
          onChange={onChange}
          variant="outlined"
          style={{ maxHeight: 38 }}
        >
          <MenuItem
            style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
            value="Day"
          >
            {words.day}
          </MenuItem>
          <MenuItem
            style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
            value="3Days"
          >
            {words.tdays}
          </MenuItem>
          <MenuItem
            style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
            value="Week"
          >
            {words.week}
          </MenuItem>
          <MenuItem
            style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
            value="Month"
          >
            {words.month}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
