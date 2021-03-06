/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, List, ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { renderIcon } from './renders';
import MenuItem from './MenuItem';
import { applyRole } from '../../common/roles';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { drawerWidth } from '../../constants';
import { useTemplate } from '../../hooks';
import { sortMenu } from '../../constants/menu';

const Menu = ({
  isRTL,
  menuitem,
  setMenuitem,
  classes,
  theme,
  user,
  menu,
  setMobileOpen,
  logout,
  client,
  navigate,
}: any) => {
  const { height } = useWindowDimensions();
  const { sortOrder } = useTemplate();
  const rmenu = sortMenu({ menu, sortOrder });
  return (
    <Box
      style={{
        marginTop: 40,
        height: height - 40,
        overflow: 'auto',
      }}
    >
      <List>
        {rmenu.map((item: any, i: any) => {
          const submenu = item.subMenu;
          const isSelected = item.name === menuitem.name;
          const role = item.role ? applyRole(item.role, user) : true;
          if (!role) {
            return <div key={item.id}></div>;
          }
          return (
            <div key={item.id}>
              {!submenu && (
                <Link
                  style={{
                    textDecoration: 'none',
                    color: isSelected ? '#333' : '#fff',
                  }}
                  to={`${item.uri}`}
                  onClick={async () => {
                    if (item.id === 99) {
                      logout();
                      await client.resetStore();
                      navigate('/');
                    } else {
                      setMenuitem(item);
                      if (setMobileOpen) {
                        setMobileOpen(false);
                      }
                    }
                  }}
                >
                  <ListItem
                    dir={isRTL ? 'rtl' : undefined}
                    className={classes.child}
                    style={{
                      cursor: 'pointer',
                      width: drawerWidth,
                      backgroundColor: isSelected
                        ? theme.palette.primary.dark
                        : undefined,
                    }}
                  >
                    {renderIcon(item.icon, theme, isSelected)}

                    <ListItemText
                      primary={isRTL ? item.titleAr : item.titleEn}
                      className={isRTL ? classes.txtrtl : classes.txtltr}
                      style={{
                        margin: 0,
                        color: isSelected
                          ? theme.palette.secondary.main
                          : undefined,
                      }}
                    />
                  </ListItem>
                </Link>
              )}
              {submenu && (
                <MenuItem
                  item={item}
                  classes={classes}
                  isSelected={isSelected}
                  isRTL={isRTL}
                  theme={theme}
                  submenu={submenu}
                  i={i}
                  setMenuitem={setMenuitem}
                  menuitem={menuitem}
                  user={user}
                  setMobileOpen={setMobileOpen}
                ></MenuItem>
              )}
            </div>
          );
        })}
      </List>
    </Box>
  );
};

export default Menu;
