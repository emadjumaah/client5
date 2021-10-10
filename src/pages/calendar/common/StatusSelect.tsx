/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { eventStatus } from "../../../constants";
import { renderStatusIcon } from "./StatusIcon";

export const StatusSelect = ({
  status,
  setStatus,
  onNewFieldChange,
  title,
  isRTL,
}: any) => {
  return (
    <Box display="flex">
      <FormControl>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          onChange={(e) => {
            const value = Number(e.target.value);
            setStatus(value);
            onNewFieldChange(value, "status");
          }}
          variant="outlined"
          style={{ maxHeight: 38, minWidth: 140 }}
        >
          {eventStatus.map((es: any) => {
            return (
              <MenuItem key={es.id} value={es.id} selected={es.id === status}>
                {isRTL ? es.nameAr : es.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box
        style={{
          display: "flex",
          minWidth: 70,
          alignItems: "center",
          height: 40,
          padding: 10,
          marginTop: 8,
        }}
      >
        <Typography>{title}</Typography>
        {renderStatusIcon(status, "#777", 30)}
      </Box>
    </Box>
  );
};
