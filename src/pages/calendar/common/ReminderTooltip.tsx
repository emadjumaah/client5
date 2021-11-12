/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@material-ui/core';
import { timeToHourMinute } from '../../../common';
import { cardClasses } from '../../../themes/classes';
import { GContextTypes } from '../../../types';
import { GlobalContext } from '../../../contexts';

export const ReminderTooltip = ({ appointmentData }: any) => {
  const {
    translate: { isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const classes = cardClasses();

  const { startDate, autoNo, title } = appointmentData;

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <Card style={{ direction: isRTL ? 'rtl' : 'ltr' }} className={classes.root}>
      <CardContent>
        <Box
          display="flex"
          style={{ alignItems: 'center', justifyContent: 'flex-end' }}
        >
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
            {autoNo}
          </Typography>
        </Box>

        <Box
          display="flex"
          style={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box>
            <Typography gutterBottom variant="subtitle2" component="h2">
              {startDate.toLocaleString(isRTL ? 'ar-QA' : 'en-US', options)}
            </Typography>
          </Box>
          <Box display="flex" style={{ marginBottom: 3 }}>
            <div>{timeToHourMinute(startDate, isRTL ? 'ar-QA' : 'en-US')}</div>
          </Box>
        </Box>
        <Divider></Divider>
        <Box style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
          <Typography style={{ fontWeight: 'bold' }} variant="h6">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
