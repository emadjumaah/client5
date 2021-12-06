import { Box, Typography } from '@material-ui/core';
import React from 'react';
import MyIcon from '../Shared/MyIcon';

export default function ImportBtns({ isRTL, theme, syncCust, syncEmpl }) {
  return (
    <Box
      display="flex"
      style={{ position: 'absolute', top: 8, left: 240, flexDirection: 'row' }}
    >
      <Box
        display="flex"
        style={{
          flexDirection: 'row',
          width: 120,
          height: 32,
          alignItems: 'center',
          justifyContent: 'space-around',
          cursor: 'pointer',
          backgroundColor: '#fff',
          borderRadius: 5,
          marginLeft: 20,
          marginRight: 20,
        }}
        onClick={syncCust}
      >
        <Typography
          style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {isRTL ? 'مزامنة العملاء' : 'Sync Customers'}
        </Typography>
        <MyIcon
          size={22}
          color={theme.palette.primary.main}
          icon="sync"
        ></MyIcon>
      </Box>
      <Box
        display="flex"
        style={{
          flexDirection: 'row',
          width: 140,
          height: 32,
          alignItems: 'center',
          justifyContent: 'space-around',
          cursor: 'pointer',
          backgroundColor: '#fff',
          borderRadius: 5,
        }}
        onClick={syncEmpl}
      >
        <Typography
          style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {isRTL ? 'مزامنة الموظفين' : 'Sync Employees'}
        </Typography>
        <MyIcon
          size={22}
          color={theme.palette.primary.main}
          icon="sync"
        ></MyIcon>
      </Box>
    </Box>
  );
}
