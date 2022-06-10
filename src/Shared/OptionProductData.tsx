/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';

export const ccyFormat = (num: number) => {
  if (num > 0) {
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  return '';
};

const OptionProductData = ({ item, isRTL, price = true }: any) => {
  return (
    <Box
      display="flex"
      ml={1}
      mr={1}
      style={{
        flex: 1,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography
            style={{
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {isRTL ? item.nameAr : item.name}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            style={{
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {item.quantity || ''}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          {price && (
            <Typography
              style={{ color: '#00B77C', width: 100, fontSize: 11 }}
              variant={isRTL ? 'subtitle1' : 'caption'}
            >
              {item.price ? ccyFormat(item.price) : '0.00'}
            </Typography>
          )}
          {!price && (
            <Typography
              style={{ color: '#00B77C', width: 100, fontSize: 11 }}
              variant={isRTL ? 'subtitle1' : 'caption'}
            >
              {item.cost ? ccyFormat(item.cost) : '0.00'}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default OptionProductData;
