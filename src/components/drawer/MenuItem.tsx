/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { renderIcon, subMenuItem } from './renders';

const MenuItem = ({
  item,
  classes,
  isRTL,
  theme,
  submenu,
  setMenuitem,
  menuitem,
  user,
  setMobileOpen,
}: any) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem
        id={item.id}
        dir={isRTL ? 'rtl' : undefined}
        className={classes.child}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {renderIcon(item.icon, theme, false)}
        <ListItemText
          primary={isRTL ? item.titleAr : item.titleEn}
          className={isRTL ? classes.txtrtl : classes.txtltr}
          style={{ marginLeft: -20, margin: 0 }}
        />
        {open ? (
          <ExpandLess style={{ color: '#f5f5f5', fontSize: 20 }} />
        ) : (
          <ExpandMore style={{ color: '#f5f5f5', fontSize: 20 }} />
        )}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {submenu.map((subitem: any) =>
            subMenuItem({
              isRTL,
              item: subitem,
              classes,
              setMenuitem,
              menuitem,
              theme,
              user,
              setMobileOpen,
            })
          )}
        </List>
      </Collapse>
    </div>
  );
};

export default MenuItem;
