/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import {
  Box,
  Container,
  Link,
  Paper,
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
import useWindowDimensions from '../../hooks/useWindowDimensions';

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
  const { height, isMobile } = useWindowDimensions();

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
    <Box
      display="flex"
      style={{
        flex: 1,
        height: height - 80,
        justifyContent: 'center',
        paddingTop: 60,
      }}
    >
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography
            color="primary"
            variant="h2"
            style={{
              zIndex: 115,
              marginBottom: 20,
              marginTop: -40,
              opacity: 0.9,
            }}
          >
            JADWAL
          </Typography>
          <Box
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 50,
              zIndex: 113,
            }}
          >
            <img
              src={
                'https://res.cloudinary.com/fivegstore/image/upload/v1635853109/256x256_fwxwfx.png'
              }
              alt={'JADWAL'}
              height={isMobile ? 130 : 150}
              style={{
                objectFit: 'cover',
                borderRadius: 10,
                opacity: 0.9,
              }}
            />
          </Box>

          <Paper
            elevation={3}
            style={{
              paddingTop: 90,
              marginTop: -120,
              borderRadius: 15,
              paddingBottom: 20,
            }}
          >
            <form className={classes.form} noValidate>
              <Box m={3}>
                <TextField
                  autoFocus
                  label={isRTL ? 'اسم المستخدم' : 'Username'}
                  name="username"
                  variant="outlined"
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
                  variant="outlined"
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
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  style={{ height: 40, fontSize: 16 }}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isRTL ? 'تسجبل الدخول' : 'Login'}
                </Button>
              </Box>
            </form>
          </Paper>
        </div>
        <Box
          mt={4}
          display="flex"
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://jadwalerp.com/">
              Jadwal
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
export default Login;
