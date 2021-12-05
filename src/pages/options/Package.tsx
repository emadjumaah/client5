import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { quantityFormat } from '../../Shared/colorFormat';
export default function Package({ company, isRTL }: any) {
  return (
    <Box
      p={1}
      style={{
        flex: 1,
        borderRadius: 10,
        padding: 20,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="button">
              {isRTL ? 'رسائل SMS' : 'SMS'}
            </Typography>
            <Typography variant="button">
              {quantityFormat(company.smss, isRTL)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="button">
              {isRTL ? 'رسائل Email' : 'Email'}
            </Typography>
            <Typography variant="button">
              {quantityFormat(company.emails, isRTL)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
