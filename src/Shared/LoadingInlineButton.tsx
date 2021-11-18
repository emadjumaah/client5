/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

const LoadingInlineButton = () => {
  return (
    <Box
      style={{
        position: 'relative',
        marginTop: 10,
      }}
      display="flex"
      flex="1"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={20} />
    </Box>
  );
};

export default LoadingInlineButton;
