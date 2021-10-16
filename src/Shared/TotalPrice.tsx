/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { moneyFormat } from './colorFormat';

export const PriceTotal = ({ amount, total, words }: any) => {
  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 65,
      }}
    >
      <Typography style={{}}>
        {words.total} : {moneyFormat(total)}
        {/* {(sum || 0).toLocaleString("en-QA", {
          style: "currency",
          currency: "QAR",
        })} */}
      </Typography>
      <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
        {words.grandtotal} : {moneyFormat(amount)}
      </Typography>
    </Box>
  );
};
