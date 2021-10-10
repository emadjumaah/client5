/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Box, TextField, Typography } from "@material-ui/core";

export default function AppointmentTextField({
  title,
  name,
  label,
  defaultValue,
  required = false,
  autoFocus = false,
}: any) {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          display: "flex",
          width: 120,
          alignItems: "center",
          height: 40,
          marginTop: 2,
        }}
      >
        <Typography>{title}</Typography>
      </Box>

      <TextField
        autoFocus={autoFocus}
        required={required}
        name={name}
        defaultValue={defaultValue}
        label={label}
        variant="outlined"
        style={{ width: 400 }}
        margin="dense"
      />
      <Box style={{ width: 56 }}></Box>
    </Box>
  );
}
