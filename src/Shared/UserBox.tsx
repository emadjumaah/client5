/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-undef */
import { Box, fade, Tooltip, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { GlobalContext } from '../contexts';
import useWindowDimensions from '../hooks/useWindowDimensions';
import Avatar from './Avatar';
import MyIcon from './MyIcon';

export default function UserBox(props: any) {
  const { theme, user, mobile, logout, client, history, isRTL } = props;
  const color = theme.palette.primary.dark;
  const { isMobile } = useWindowDimensions();
  const {
    store: { lang },
    dispatch,
  } = useContext(GlobalContext);

  const uname = user.name ? user.name : user.username;

  return (
    <Box
      style={{
        display: 'flex',
        width: isMobile ? undefined : 250,
        position: isMobile ? undefined : 'fixed',
        height: 50,
        zIndex: 114,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isMobile ? undefined : theme.palette.secondary.main,
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
            <Box
              display="flex"
              style={{
                flex: 4,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Box
                display="flex"
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ color: isMobile ? '#fff' : color }}
                >
                  {uname.substring(0, 10)}
                </Typography>
              </Box>
              <Avatar
                username={user.username}
                name={user.name}
                size={34}
              ></Avatar>
            </Box>
            <Tooltip
              title={
                lang === 'ar' ? 'Change to English' : 'تغيير الى اللغة العربية'
              }
            >
              <Box
                display="flex"
                style={{
                  width: 34,
                  height: 34,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  dispatch({
                    type: 'setLang',
                    payload: lang === 'ar' ? 'en' : 'ar',
                  });
                  window.location.reload();
                }}
              >
                <MyIcon
                  size={24}
                  color={isMobile ? '#fff' : color}
                  icon={'lang'}
                ></MyIcon>
              </Box>
            </Tooltip>
            <Tooltip title={isRTL ? 'تسجيل الخروج' : 'Logout'}>
              <Box
                display="flex"
                style={{
                  width: 34,
                  height: 34,
                  flex: 1,
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
            </Tooltip>
          </Box>
        </React.Fragment>
      )}
      <div
        style={{
          width: 1,
          height: 50,
          backgroundColor: fade(theme.palette.secondary.light, 0.5),
          display: isMobile ? 'none' : undefined,
        }}
      ></div>
    </Box>
  );
}
