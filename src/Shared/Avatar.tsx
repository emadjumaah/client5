/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-undef */
import { Box, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { nameToColor } from '../common';

export default function Avatar({
  name,
  username,
  size = 40,
  bc = '#ddd',
  bg,
}: any) {
  const uname = name ? name : username;
  const color = bg ? bg : uname ? nameToColor(`${uname}Jadwal`) : '';
  const names = uname ? uname.split(' ') : '';
  let letters = '';
  if (names.length > 1) {
    uname
      ? (letters = `${names[0].substring(0, 1).toUpperCase()}${names[1]
          .substring(0, 1)
          .toUpperCase()}`)
      : (letters = '');
  } else {
    uname ? (letters = uname.substring(0, 2).toUpperCase()) : (letters = '');
  }

  return (
    <Tooltip title={uname ? uname : ''}>
      <Box
        border={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderColor: bc,
        }}
      >
        <Typography
          style={{
            color: '#f5f5f5',
            fontFamily: 'sans-serif',
            fontSize: size / 2 - size / 8,
          }}
        >
          {letters}
        </Typography>
      </Box>
    </Tooltip>
  );
}
