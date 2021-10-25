/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { sToMAndS } from '../common/helpers';

const Timer = ({ time }) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const [tim, settim] = useState('');
  useEffect(() => {
    if (!timeLeft) return () => null;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    const tm = sToMAndS(timeLeft);
    settim(tm);
  }, [timeLeft]);

  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
      }}
    >
      <Typography variant="h3">Please wait ... {tim}</Typography>
    </Box>
  );
};
export default Timer;
