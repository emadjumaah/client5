/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import Logo from './Logo';
import { useMutation } from '@apollo/client';
import { sendVerificationCode, verifyEmail } from '../../graphql';
import { validateEmail } from '../../common/check';
import { AlertLocal } from '../../components';
import { errorAlert, messageAlert } from '../../Shared';
import { messageShow } from '../../Shared/helpers';
import RegisterCompany from './RegisterCompany';
import CountDown from '../../Shared/CountDown';
import LoadingInlineButton from '../../Shared/LoadingInlineButton';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { loginClasses } from '../../themes';

const timeToWait = 900000;
const possibleWrong = 15;

export default function Register({
  setReg,
  isRTL,
  dispatch,
  wrongTimes,
  startBlock,
  words,
}: any) {
  const classes = loginClasses();

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const timeFromBlock = Date.now() - startBlock;
  const validtime = startBlock ? timeFromBlock > timeToWait : true;
  const remaningTime = Math.floor((timeToWait - timeFromBlock) / 1000);

  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState(null);
  const [sent, setSent] = useState(null);
  const [verified, setVerified] = useState(null);

  const [sendCode] = useMutation(sendVerificationCode);
  const [verifyCode] = useMutation(verifyEmail);
  const [loading, setLoading] = useState(false);
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

  const onSendCode = async () => {
    const validemail = validateEmail(email);
    if (!validemail) {
      await messageAlert(
        setAlrt,
        isRTL ? `البريد الالكتروني غير صالح` : `incorrect email`
      );
      return;
    }
    setLoading(true);
    const res = await sendCode({ variables: { email } });
    if (res?.data?.sendVerificationCode?.ok === false) {
      if (res?.data?.sendVerificationCode?.message === 'user exists') {
        await messageAlert(
          setAlrt,
          isRTL ? `هذا البريد موجود مسبقاً` : `Email Exists`
        );
      } else {
        await errorAlert(setAlrt, isRTL);
      }
      setLoading(false);
      return;
    }
    if (res?.data?.sendVerificationCode?.ok === true) {
      await messageShow(
        setAlrt,
        isRTL
          ? `تم ارسال رمز الدخول الى البريد الالكتروني`
          : `passcode was sent to your email`
      );
      setLoading(false);
      setSent(true);
    }
    setLoading(false);
  };
  const onVerifyCode = async () => {
    if (!passcode) {
      await messageAlert(
        setAlrt,
        isRTL ? `يرجى ادخال رمز التحقق` : `please enter the passcode`
      );
      return;
    }
    setLoading(true);
    const res = await verifyCode({ variables: { email, passcode } });
    if (res?.data?.verifyEmail?.ok === false) {
      await errorAlert(setAlrt, isRTL);
      dispatch({ type: 'setWrongTimes' });
      if (wrongTimes > possibleWrong) {
        dispatch({ type: 'setStartBlock', payload: Date.now() });
      }
      setLoading(false);
      return;
    }
    if (res?.data?.verifyEmail?.ok === true) {
      await messageShow(
        setAlrt,
        isRTL ? `تم تأكيد ملكية البريد` : `Email Verified`
      );
      initStoreState();
      setVerified(true);
      setLoading(false);
    }
    setLoading(false);
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
                  label={isRTL ? 'البريد الالكتروني' : 'Email'}
                  name="username"
                  size="medium"
                  value={email}
                  disabled={sent}
                  onChange={(e: any) => setEmail(e.target.value)}
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
                {sent && !verified && (
                  <TextField
                    label={isRTL ? 'رمز التحقق' : 'Passcode'}
                    name="passcode"
                    size="medium"
                    variant="outlined"
                    value={passcode}
                    onChange={(e: any) => setPasscode(Number(e.target.value))}
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
                    fullWidth
                  />
                )}
                {!sent && !verified && (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={{ height: 42, fontSize: 16, marginTop: 20 }}
                      onClick={onSendCode}
                      disabled={loading}
                    >
                      {isRTL ? 'ارسال رمز التحقق' : 'Send Passcode'}
                    </Button>
                    {loading && <LoadingInlineButton></LoadingInlineButton>}
                  </>
                )}
                {sent && !verified && (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={{ height: 42, fontSize: 16, marginTop: 10 }}
                      onClick={onVerifyCode}
                      disabled={loading}
                    >
                      {isRTL ? 'التالي' : 'Next'}
                    </Button>
                    {loading && <LoadingInlineButton></LoadingInlineButton>}
                  </>
                )}
                {verified && (
                  <RegisterCompany
                    email={email}
                    words={words}
                    isRTL={isRTL}
                    setReg={setReg}
                    alrt={alert}
                    setAlrt={setAlrt}
                  ></RegisterCompany>
                )}
              </Box>
            </form>
          </Box>
          <Box
            display="flex"
            style={{
              marginTop: 100,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Button variant="outlined" onClick={() => setReg(false)}>
              <Typography variant="body2">
                {isRTL ? 'العودة لصفحة تسجيل الدخول' : 'Back to Login Page'}
              </Typography>
            </Button>
          </Box>
        </div>
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
            w
          ></AlertLocal>
        )}
      </div>
    </Box>
  );
}
