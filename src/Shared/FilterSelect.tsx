/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import OptionFilterItem from "./OptionFilterItem";

export default function FilterSelectCkeckBox({
  options,
  value,
  setValue,
  words,
  isRTL,
  name,
  width,
  fullWidth,
}: any) {
  return (
    <Autocomplete
      size="small"
      options={options}
      getOptionLabel={(option: any) => (isRTL ? option.nameAr : option.name)}
      getOptionSelected={(option, values) => option.id === values.id}
      renderOption={(option) => (
        <OptionFilterItem isRTL={isRTL} item={option}></OptionFilterItem>
      )}
      value={value}
      onChange={(_, newValue: any) => {
        setValue(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          id={name}
          fullWidth={fullWidth}
          name={name}
          label={words[name]}
          variant="outlined"
          style={{
            width: width ? width : undefined,
            backgroundColor: value ? "#FFF5D6" : undefined,
            fontSize: 10,
          }}
        ></TextField>
      )}
    />
  );
}
