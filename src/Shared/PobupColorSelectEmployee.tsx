/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import { colors } from '../constants';
import { employeeColorStyle } from './colorFormat';

export default function PobupColorSelectEmployee({
  register,
  errors,
  name,
  label,
  row,
}: any) {
  const theme = useTheme();
  return (
    <FormControl margin="dense">
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: theme.palette.secondary.light,
          borderRadius: 5,
        }}
      >
        <Box
          style={{
            display: 'flex',
            width: 70,
            alignItems: 'center',
            height: 40,
            padding: 10,
          }}
        >
          <Typography>{label}</Typography>
        </Box>
        <Box style={{ display: 'flex' }}>
          <Select
            name={name}
            labelId="select-helper-label"
            onChange={(e) => register({ name: 'color', value: e.target.value })}
            // value={row?.[name] || ""}
            defaultValue={row?.[name] || ''}
            error={errors[name] ? true : false}
            autoWidth
            variant="outlined"
            margin="dense"
            style={{ minWidth: 305 }}
          >
            {colors.map((col: any) => (
              <MenuItem key={col} value={col}>
                <Box
                  style={{
                    width: 250,
                    height: 20,
                    backgroundColor: col,
                    ...employeeColorStyle,
                  }}
                ></Box>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </FormControl>
  );
}
