/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-undef */
import {
  Box,
  createStyles,
  fade,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core';
import React, { useState } from 'react';
import { roles } from '../common';
import { drawerWidth } from '../constants';
import MyIcon from './MyIcon';

export const maimenuClasses = makeStyles((theme: Theme) =>
  createStyles({
    child: {
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.main, 0.5),
      },
    },
  })
);

export default function MainVav(props: any) {
  const classes = maimenuClasses();

  const [activemenu, setActivemenu] = useState(1);

  const { theme, isRTL, setMmenu } = props;
  const handleMenu = (value: any) => {
    setActivemenu(value);
    setMmenu(value);
  };
  const activecolor = theme.palette.secondary.main;
  const activeicon = theme.palette.primary.light;
  return (
    <Box
      style={{
        display: 'flex',
        width: drawerWidth,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.primary.light,
      }}
    >
      <Tooltip title={isRTL ? 'الصفحة الرئيسية' : 'Main Page'}>
        <Box
          display="flex"
          style={{
            flex: 1,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: activemenu === 1 ? activecolor : undefined,
          }}
          onClick={() => handleMenu(1)}
          className={classes.child}
        >
          <MyIcon
            size={24}
            color={activemenu === 1 ? activeicon : '#fff'}
            icon={'home'}
          ></MyIcon>
        </Box>
      </Tooltip>
      {roles.isBranchAdmin() && (
        <Tooltip title={isRTL ? 'الرسائل النصية' : 'SMS System'}>
          <Box
            display="flex"
            style={{
              height: 40,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: activemenu === 2 ? activecolor : undefined,
            }}
            className={classes.child}
            onClick={() => handleMenu(2)}
          >
            <MyIcon
              size={24}
              color={activemenu === 2 ? activeicon : '#fff'}
              icon={'email'}
            ></MyIcon>
          </Box>
        </Tooltip>
      )}
      <Tooltip title={isRTL ? 'المفكرة' : 'Reminder'}>
        <Box
          display="flex"
          style={{
            height: 40,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: activemenu === 3 ? activecolor : undefined,
          }}
          className={classes.child}
          onClick={() => handleMenu(3)}
        >
          <MyIcon
            size={24}
            color={activemenu === 3 ? activeicon : '#fff'}
            icon={'bell'}
          ></MyIcon>
        </Box>
      </Tooltip>
    </Box>
  );
}
