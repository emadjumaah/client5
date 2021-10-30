/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-undef */
import { Box, Hidden, Typography } from '@material-ui/core';
import React from 'react';
import Avatar from './Avatar';
import MyIcon from './MyIcon';

export default function UserBox(props: any) {
  const { theme, user, network, mobile, logout, client, history } = props;
  const isWeb = network === 'web';
  const color = isWeb
    ? theme.palette.background.default
    : theme.palette.background.default;

  return (
    <Box
      style={{
        display: 'flex',
      }}
    >
      {user && (
        <React.Fragment>
          <Box
            display="flex"
            alignItems="center"
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flex: 1,
              paddingRight: mobile ? undefined : 10,
              paddingLeft: mobile ? undefined : 10,
              marginTop: mobile ? undefined : 10,
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
                  marginTop: 2,
                }}
              >
                <Typography style={{ color }}>
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
                <MyIcon size={24} color={'#eee'} icon={'logout'}></MyIcon>
              </Box>
            </Hidden>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
