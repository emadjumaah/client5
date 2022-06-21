/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

const Loading = ({ isRTL }) => {
  return (
    <Box
      style={{
        position: 'absolute',
        top: 5,
        right: isRTL ? undefined : 25,
        left: isRTL ? 25 : undefined,
      }}
      display="flex"
      flex="1"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
