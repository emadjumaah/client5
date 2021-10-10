/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Box, IconButton, TextField, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { Autocomplete } from "@material-ui/lab";
import OptionItemData from "./OptionItemData";

export default function ServiceAutoField({
  name,
  title,
  options,
  value,
  defaultValue,
  onNewFieldChange,
  setPricevalue,
  open,
  priceValue,
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
          autoSelect
          options={options}
          getOptionLabel={(option: any) =>
            isRTL ? option.nameAr : option.name
          }
          getOptionSelected={(option, values) => option._id === values._id}
          renderOption={(option) => (
            <OptionItemData isRTL={isRTL} item={option}></OptionItemData>
          )}
          value={value}
          defaultValue={defaultValue}
          onChange={(_, newValue: any) => {
            onNewFieldChange(newValue, name);
            if (setPricevalue) {
              setPricevalue(newValue?.price);
            } else {
              onNewFieldChange(newValue?.price, "amount");
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              id={name}
              name={name}
              variant="outlined"
              style={{ width: 350 }}
              // onChange={(e: any) => setNewtext(e.target.value)}
            ></TextField>
          )}
        />

        <TextField
          name="amount"
          onChange={(e: any) => {
            if (setPricevalue) {
              setPricevalue(Number(e.target.value));
            } else {
              onNewFieldChange(Number(e.target.value), "amount");
            }
          }}
          value={priceValue}
          label="Price"
          variant="outlined"
          type="number"
          style={{
            width: 150,
            marginLeft: isRTL ? undefined : 20,
            marginRight: isRTL ? 20 : undefined,
            paddingLeft: 10,
            paddingRight: 10,
          }}
          margin="dense"
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
