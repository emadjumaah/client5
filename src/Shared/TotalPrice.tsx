/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { moneyFormat } from './colorFormat';

export const PriceTotal = ({
  amount,
  total,
  words,
  totalonly,
  end = true,
}: any) => {
  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: end ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        height: 65,
      }}
    >
      {!totalonly && (
        <Typography style={{}}>
          {words.total} : {moneyFormat(total)}
          {/* {(sum || 0).toLocaleString("en-QA", {
          style: "currency",
          currency: "QAR",
        })} */}
        </Typography>
      )}
      <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
        {totalonly ? words.total : words.grandtotal}: {moneyFormat(amount)}
      </Typography>
    </Box>
  );
};
