/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useState } from 'react';
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

const Login = (): any => {
  const classes = loginClasses();

  const [error, seterror] = useState(null);

  const { register, handleSubmit, errors }: any = useForm(yup.loginResolver);
  const {
    dispatch,
    translate: { isRTL },
  }: GContextTypes = useContext(GlobalContext);
  const [dologin] = useMutation(login);

  const onSubmit = async (dt: any) => {
    const { username, password } = dt;
    const userData = await dologin({ variables: { username, password } });
    if (userData?.data?.login?.ok === true) {
      const { data, accessToken, refreshToken } = userData.data.login;
      const user = {
        ...data,
        roles: JSON.parse(data.roles),
      };
      await client.resetStore();
      const token = JSON.stringify({ accessToken, refreshToken });
      dispatch({ type: 'login', payload: { user, token } });
      window.location.reload();
      seterror(null);
    } else if (userData?.data?.login?.ok === false) {
      seterror(userData.data.login.error);
    }
  };

  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      handleSubmit(onSubmit)();
    }
  };

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
            <TextField
              autoFocus
              label={isRTL ? 'اسم المستخدم' : 'Username'}
              name="username"
              variant="outlined"
              inputRef={register}
              error={errors.username ? true : false}
              onKeyDown={keyPress}
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
          </form>
        </div>
        <Box mt={8}>
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://jadwalerp.com/">
              Jadwal ERP
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </>
  );
};
export default Login;
