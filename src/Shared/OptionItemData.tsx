/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Typography } from '@material-ui/core';

export const ccyFormat = (num: number) => {
  if (num > 0) {
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  return '';
};

const OptionItemData = ({ item, isRTL }: any) => {
  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Box style={{ position: 'relative', top: 7 }}>
        <Box>
          <Typography
            style={{
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {isRTL ? item.nameAr : item.name}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" style={{ marginBottom: 5 }}>
          <Typography
            style={{ color: '#00B77C', width: 100, fontSize: 11 }}
            variant={isRTL ? 'subtitle1' : 'caption'}
          >
            {item.price ? ccyFormat(item.price) : ''}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default OptionItemData;
