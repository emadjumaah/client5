/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import { FormControl, MenuItem, Select } from "@material-ui/core";

export const ReportGroupBySwitcher = ({
  options,
  value,
  onChange,
  isRTL,
}: any) => {
  return (
    <FormControl>
      <Select
        id="simple-menu"
        value={value}
        onChange={onChange}
        variant="outlined"
        style={{
          height: 38,
          width: 180,
          alignSelf: "flex-end",
          fontSize: 12,
          fontWeight: "bold",
          color: "#555",
        }}
      >
        {options.map((item: any) => {
          return (
            <MenuItem
              key={item.id}
              style={{ justifyContent: isRTL ? "flex-end" : "flex-start" }}
              value={item.value}
            >
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
