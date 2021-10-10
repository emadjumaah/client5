/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Box, IconButton, TextField, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { Autocomplete } from "@material-ui/lab";
import OptionItem from "./OptionItem";

export default function CustomerAutoField({
  name,
  title,
  options,
  value,
  onNewFieldChange,
  open,
  required = false,
  autoFocus = false,
  setNewtext,
  isRTL,
  canAdd,
}: any) {
  return (
    <Box>
      <Box
        style={{
          display: "flex",
          width: 120,
          alignItems: "center",
          height: 40,
          padding: 10,
          marginTop: 10,
        }}
      >
        <Typography>{title}</Typography>
      </Box>

      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: -15,
        }}
      >
        <Autocomplete
          // autoSelect
          options={options}
          getOptionLabel={(option: any) =>
            isRTL ? option.nameAr : option.name
          }
          getOptionSelected={(option, values) => option._id === values._id}
          renderOption={(option) => (
            <OptionItem isRTL={isRTL} item={option}></OptionItem>
          )}
          value={value}
          onChange={(_, newValue: any) => {
            onNewFieldChange(newValue, name);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              id={name}
              name={name}
              variant="outlined"
              style={{ width: 300 }}
            ></TextField>
          )}
        />
        <Autocomplete
          // autoSelect
          options={options}
          getOptionLabel={(option: any) => option.phone}
          getOptionSelected={(option, values) => option._id === values._id}
          value={value}
          onChange={(_, newValue: any) => {
            onNewFieldChange(newValue, name);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              id={name}
              name={name}
              variant="outlined"
              style={{
                width: 200,
                marginLeft: isRTL ? undefined : 20,
                marginRight: isRTL ? 20 : undefined,
              }}
              onChange={(e: any) => setNewtext(e.target.value)}
            ></TextField>
          )}
        />
        {canAdd && (
          <IconButton disableFocusRipple onClick={open}>
            <AddIcon></AddIcon>
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
