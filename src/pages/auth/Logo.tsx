import { Box, Typography } from '@material-ui/core';
import React from 'react';

export default function Logo() {
  return (
    <Box
      display="flex"
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
      }}
    >
      <Box
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99,
        }}
      >
        <img
          src={
            'https://res.cloudinary.com/fivegstore/image/upload/v1635853109/256x256_fwxwfx.png'
          }
          alt={'JADWAL'}
          height={60}
          style={{
            objectFit: 'cover',
            borderRadius: 10,
            opacity: 0.9,
          }}
        />
      </Box>
      <Box>
        <Typography
          color="primary"
          style={{
            zIndex: 115,
            margin: 20,
            opacity: 0.9,
            fontSize: 40,
            fontWeight: 'lighter',
          }}
        >
          JADWAL
        </Typography>
      </Box>
    </Box>
  );
}
