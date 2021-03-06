/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import Alert from '@material-ui/lab/Alert';
import MyIcon from '../../Shared/MyIcon';
import { Box, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function AlertWithClose({ open, msg, isRTL, onClose }: any) {
  const { width } = useWindowDimensions();

  if (!open) return <div></div>;
  return (
    <Alert
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        position: 'absolute',
        top: 15,
        width: width - 270,
        height: 60,
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
      }}
      severity={'error'}
    >
      <Box
        display="flex"
        style={{
          width: width - 375,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption">{msg}</Typography>
        <Box onClick={() => onClose()} style={{ cursor: 'pointer' }}>
          <MyIcon size={28} color="#ff80ed" icon="close"></MyIcon>
        </Box>
      </Box>
    </Alert>
  );
}
