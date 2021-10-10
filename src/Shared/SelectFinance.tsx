/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

export default function SelectFinance({
  errors,
  name,
  label,
  options,
  account,
  setAccount,
  isRTL,
  fullWidth,
}: any) {
  return (
    <FormControl style={{ marginBottom: 20 }} margin="dense">
      <Box style={{}}>
        <Typography>{label}</Typography>
      </Box>
      <Select
        name={name}
        labelId="select-helper-label"
        onChange={(e) => {
          setAccount(e.target.value);
        }}
        value={account || ""}
        error={errors[name] ? true : false}
        autoWidth
        variant="outlined"
        margin="dense"
        style={{ minWidth: 185 }}
      >
        {options.map((option: any) => (
          <MenuItem key={option._id} value={option}>
            <Box style={{ minWidth: 100 }}>
              <Typography style={{ textAlign: isRTL ? "right" : "left" }}>
                {isRTL ? option.nameAr : option.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
