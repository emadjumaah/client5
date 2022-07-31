/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { fade, Hidden, Paper, Typography } from '@material-ui/core';
import React from 'react';
import RefetchBox from '../../Shared/RefetchBox';

export default function PageLayout(props: any) {
  const {
    children,
    menuitem,
    isRTL,
    refresh,
    theme,
    bgcolor = fade(theme.palette.primary.light, 0.1),
    loading,
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
            <RefetchBox
              isRTL={isRTL}
              theme={theme}
              refresh={refresh}
              loading={loading}
            ></RefetchBox>
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
