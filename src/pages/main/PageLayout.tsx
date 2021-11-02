/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Box,
  fade,
  Hidden,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

export default function PageLayout(props: any) {
  const { children, menuitem, isRTL, refresh, theme } = props;

  return (
    <Paper elevation={2} square>
      <Hidden xsDown implementation="css">
        <Box
          style={{
            paddingLeft: 30,
            paddingRight: 30,
            height: 50,
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f5f5f5',
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
            <IconButton
              style={{
                backgroundColor: fade(theme.palette.primary.light, 0.7),
                padding: 7,
              }}
              onClick={refresh}
            >
              <RefreshOutlinedIcon
                style={{ fontSize: 24, color: '#f5f5f5' }}
                color="primary"
              ></RefreshOutlinedIcon>
            </IconButton>
          )}
        </Box>
      </Hidden>
      {React.cloneElement(children, { ...props })}
    </Paper>
  );
}
