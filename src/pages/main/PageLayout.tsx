/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  fade,
  Hidden,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React from 'react';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

export default function PageLayout(props: any) {
  const {
    children,
    menuitem,
    isRTL,
    refresh,
    theme,
    bgcolor = fade(theme.palette.primary.light, 0.1),
  } = props;

  return (
    <Paper square>
      <Hidden xsDown implementation="css">
        <div
          style={{
            paddingLeft: 30,
            paddingRight: 30,
            height: 49,
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: bgcolor,
          }}
        >
          <Typography
            style={{
              color: theme.palette.primary.main,
              fontSize: 22,
              // color: '#f5f5f5',
            }}
          >
            {isRTL ? menuitem.titleAr : menuitem.titleEn}
          </Typography>
          {refresh && (
            <Tooltip title={isRTL ? 'تحديث' : 'Refresh'}>
              <IconButton
                style={{
                  backgroundColor: fade(theme.palette.primary.light, 0.5),
                  padding: 7,
                }}
                onClick={refresh}
              >
                <RefreshOutlinedIcon
                  style={{ fontSize: 24, color: '#f5f5f5' }}
                  color="primary"
                ></RefreshOutlinedIcon>
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div
          style={{
            height: 1,
            display: 'flex',
            flex: 1,
            backgroundColor: bgcolor,
          }}
        ></div>
      </Hidden>
      {React.cloneElement(children, { ...props })}
    </Paper>
  );
}
