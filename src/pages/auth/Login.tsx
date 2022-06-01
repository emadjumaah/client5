/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import { Box, Link, TextField, Typography } from '@material-ui/core';
import { login } from '../../graphql/mutation';
import { yup } from '../../constants';
import { loginClasses } from '../../themes';
import { client } from '../../graphql';
import CountDown from '../../Shared/CountDown';
import { templates } from '../../constants';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import Logo from './Logo';

const timeToWait = 900000;
const possibleWrong = 15;

const getTemplate = (tempId: any) => {
  if (!tempId) return templates[0];
  const template = templates.filter((temp: any) => temp.id === tempId)?.[0];
  return template;
};

const Login = ({ dispatch, wrongTimes, startBlock, isRTL }: any): any => {
  const classes = loginClasses();
  const [error, seterror] = useState(null);

  const { register, handleSubmit, errors }: any = useForm(yup.loginResolver);

  const [dologin] = useMutation(login);

  const timeFromBlock = Date.now() - startBlock;
  const validtime = startBlock ? timeFromBlock > timeToWait : true;
  const remaningTime = Math.floor((timeToWait - timeFromBlock) / 1000);
  const { height } = useWindowDimensions();

  const initStoreState = () => {
    dispatch({ type: 'setLastSuccess', payload: Date.now() });
    dispatch({ type: 'setWrongTimes', payload: 0 });
    dispatch({ type: 'setStartBlock', payload: null });
  };

  useEffect(() => {
    if (validtime) {
      initStoreState();
    }
  }, [validtime]);

  const onSubmit = async (dt: any) => {
    const { username, password } = dt;
    const userData = await dologin({ variables: { username, password } });
    if (userData?.data?.login?.ok === true) {
      initStoreState();
      const { data, accessToken, refreshToken, tempId } = userData.data.login;
      const user = {
        ...data,
        roles: JSON.parse(data.roles),
      };
      await client.resetStore();
      const token = JSON.stringify({ accessToken, refreshToken });
      const template = getTemplate(tempId);

      dispatch({
        type: 'login',
        payload: { user, token, template },
      });
      dispatch({
        type: 'setThemeId',
        payload: user?.themeId ? user?.themeId : template?.id - 1,
      });
      seterror(null);
      window.location.reload();
    } else if (userData?.data?.login?.ok === false) {
      seterror(userData.data.login.error);
      dispatch({ type: 'setWrongTimes' });
      if (wrongTimes > possibleWrong) {
        dispatch({ type: 'setStartBlock', payload: Date.now() });
      }
    }
  };

  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      handleSubmit(onSubmit)();
    }
  };

  if (!validtime) {
    return <CountDown time={remaningTime}></CountDown>;
  }

  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        height: height - 140,
        justifyContent: 'center',
        paddingTop: 20,
      }}
    >
      <div>
        <div className={classes.paper}>
          <Logo></Logo>
          <Box
            border={1}
            borderColor="#ddd"
            style={{
              paddingTop: 10,
              borderRadius: 10,
              paddingBottom: 20,
            }}
          >
            <form className={classes.form} noValidate>
              <Box m={3}>
                <TextField
                  label={isRTL ? 'اسم المستخدم' : 'Username'}
                  name="username"
                  inputRef={register}
                  error={errors.username ? true : false}
                  onKeyDown={keyPress}
                  size="medium"
                  inputProps={{
                    style: {
                      height: 22,
                      fontSize: 16,
                      margin: 0,
                      paddingLeft: 10,
                      paddingRight: 10,
                    },
                  }}
                  style={{ marginBottom: 20 }}
                  required
                  fullWidth
                />
                <TextField
                  name="password"
                  label={isRTL ? 'كلمة المرور' : 'Password'}
                  type="password"
                  inputRef={register}
                  error={errors.password ? true : false}
                  onKeyDown={keyPress}
                  helperText={error ? error : undefined}
                  inputProps={{
                    style: {
                      height: 22,
                      fontSize: 16,
                      margin: 0,
                      paddingLeft: 10,
                      paddingRight: 10,
                    },
                  }}
                  style={{ marginBottom: 20 }}
                  required
                  fullWidth
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  style={{ height: 42, fontSize: 16, marginTop: 30 }}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isRTL ? 'تسجبل الدخول' : 'Login'}
                </Button>
              </Box>
            </form>
          </Box>
        </div>
        <Box
          display="flex"
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 80,
          }}
        >
          <Typography variant="body1" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://jadwal.io/">
              Jadwal
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </div>
    </Box>
  );
};
export default Login;
