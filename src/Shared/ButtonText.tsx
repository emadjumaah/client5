/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Typography } from '@material-ui/core';
import React from 'react';

export default function ButtonText({ title }: any): any {
  return (
    <Typography style={{ marginLeft: 10, marginRight: 10 }} variant="button">
      {title}
    </Typography>
  );
}
