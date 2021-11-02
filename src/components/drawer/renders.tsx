/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, fade } from '@material-ui/core';

import { ListItem, ListItemText } from '@material-ui/core';

import { Link } from 'react-router-dom';
import { applyRole } from '../../common/roles';
import MyIcon from '../../Shared/MyIcon';

export const renderIcon = (icon: any, theme: any, isSelected: any) => {
  const color = isSelected ? fade(theme.palette.secondary.main, 0.8) : '#fff';
  return (
    <Box
      display="flex"
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 0,
        margin: 0,
        width: 40,
        height: 25,
      }}
    >
      <MyIcon icon={icon} color={color} size={25}></MyIcon>
    </Box>
  );
};

export const subMenuItem = ({
  isRTL,
  classes,
  setMenuitem,
  menuitem,
  item,
  theme,
  user,
  setMobileOpen,
}: any) => {
  const isSelected = item.name === menuitem.name;
  const role = item.role ? applyRole(item.role, user) : true;
  if (!role) {
    return <div key={item.id}></div>;
  }

  return (
    <Link
      style={{
        textDecoration: 'none',
        color: isSelected
          ? '#eee'
          : fade(theme.palette.background.default, 0.8),
      }}
      to={`${item.uri}`}
      onClick={() => {
        setMenuitem(item);
        if (setMobileOpen) {
          setMobileOpen(false);
        }
      }}
      key={item.id}
    >
      <ListItem
        button
        className={classes.child2}
        style={{
          backgroundColor: isSelected ? theme.palette.primary.dark : undefined,
        }}
      >
        <ListItemText
          primary={isRTL ? item.titleAr : item.titleEn}
          style={{
            color: isSelected ? theme.palette.secondary.main : undefined,
            margin: 0,
          }}
        />
      </ListItem>
    </Link>
  );
};
