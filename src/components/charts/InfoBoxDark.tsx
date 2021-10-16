/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Box, fade, Grid } from '@material-ui/core';
import { InfoAmount, InfoIcon, InfoTitle } from './common';

export default function InfoBoxDark({ title, value, icon, salesColor }: any) {
  const cf = fade(salesColor, 0.8);
  return (
    <Paper style={{ height: 116, background: cf }}>
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Box
              display="flex"
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <InfoIcon color="#fafafa" icon={icon}></InfoIcon>
              <InfoTitle color="#fafafa" title={title}></InfoTitle>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <InfoAmount color="#fafafa" value={value}></InfoAmount>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
