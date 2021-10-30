/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Button from '@material-ui/core/Button';
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { login } from '../../graphql/mutation';
import { yup } from '../../constants';
import { GContextTypes } from '../../types';
import { GlobalContext } from '../../contexts';
import { loginClasses } from '../../themes';
import { client } from '../../graphql';
import CountDown from '../../Shared/CountDown';
import { templates } from '../../constants/roles';

const timeToWait = 900000;
const possibleWrong = 15;

const Login = (): any => {
  const classes = loginClasses();

  const [error, seterror] = useState(null);

  const { register, handleSubmit, errors }: any = useForm(yup.loginResolver);
  const {
    dispatch,
    store: { wrongTimes, startBlock },
    translate: { isRTL },
  }: GContextTypes = useContext(GlobalContext);
  const [dologin] = useMutation(login);

  const timeFromBlock = Date.now() - startBlock;
  const validtime = startBlock ? timeFromBlock > timeToWait : true;
  const remaningTime = Math.floor((timeToWait - timeFromBlock) / 1000);

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
      const { data, accessToken, refreshToken, template } = userData.data.login;
      const user = {
        ...data,
        roles: JSON.parse(data.roles),
      };
      await client.resetStore();
      const token = JSON.stringify({ accessToken, refreshToken });
      const temp = template ? JSON.parse(template) : templates[0];
      dispatch({
        type: 'login',
        payload: { user, token, template: temp },
      });
      window.location.reload();
      seterror(null);
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
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isRTL ? 'تسجيل الدخول' : 'Sign in'}
          </Typography>

          <form className={classes.form} noValidate>
            <Box m={2}>
              <TextField
                autoFocus
                label={isRTL ? 'اسم المستخدم' : 'Username'}
                name="username"
                variant="outlined"
                inputRef={register}
                error={errors.username ? true : false}
                onKeyDown={keyPress}
                style={{ height: 50 }}
                required
                fullWidth
              />
              <TextField
                name="password"
                label={isRTL ? 'كلمة المرور' : 'Password'}
                type="password"
                variant="outlined"
                inputRef={register}
                error={errors.password ? true : false}
                onKeyDown={keyPress}
                helperText={error ? error : undefined}
                required
                fullWidth
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                style={{ height: 40 }}
                onClick={handleSubmit(onSubmit)}
              >
                {isRTL ? 'تسجبل الدخول' : 'Login'}
              </Button>
            </Box>
          </form>
        </div>
      </Container>
      <Box
        mt={10}
        display="flex"
        style={{
          position: 'fixed',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 40,
          width: '100%',
        }}
      >
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://jadwalerp.com/">
            Jadwal ERP
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </>
  );
};
export default Login;
