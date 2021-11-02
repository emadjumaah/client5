/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-undef */
import { Box, Hidden, Typography } from '@material-ui/core';
import React from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import Avatar from './Avatar';
import MyIcon from './MyIcon';

export default function UserBox(props: any) {
  const { theme, user, mobile, logout, client, history } = props;
  const color = theme.palette.primary.main;
  const { isMobile } = useWindowDimensions();

  return (
    <Box
      style={{
        display: 'flex',
        width: isMobile ? undefined : 249,
        position: isMobile ? undefined : 'fixed',
        height: 50,
        zIndex: 114,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isMobile ? undefined : '#f5f5f5',
      }}
    >
      {user && (
        <React.Fragment>
          <Box
            display="flex"
            alignItems="center"
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              flex: 1,
              paddingRight: mobile ? undefined : 10,
              paddingLeft: mobile ? undefined : 10,
            }}
          >
            <Box display="flex">
              <Box
                display="flex"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ color: isMobile ? '#fff' : color }}
                >
                  {user.name ? user.name : user.username}
                </Typography>
              </Box>
              <Avatar
                username={user.username}
                name={user.name}
                size={34}
              ></Avatar>
            </Box>
            <Hidden xsDown implementation="js">
              <Box
                display="flex"
                style={{
                  width: 34,
                  height: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  logout();
                  await client.resetStore();
                  history.push('/');
                }}
              >
                <MyIcon
                  size={24}
                  color={isMobile ? '#fff' : color}
                  icon={'logout'}
                ></MyIcon>
              </Box>
            </Hidden>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
