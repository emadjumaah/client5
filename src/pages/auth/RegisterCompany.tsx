import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { TextFieldLocal } from '../../components';
import { packages, templates } from '../../constants/roles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { errorAlert, messageAlert } from '../../Shared';
import { phoneRegExp } from '../../constants/yupSchemas';
import { useMutation } from '@apollo/client';
import { createUserBranch } from '../../graphql';
import LoadingInlineButton from '../../Shared/LoadingInlineButton';
import { messageShow } from '../../Shared/helpers';
export default function RegisterCompany({
  email,
  words,
  isRTL,
  setReg,
  setAlrt,
}: any) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [viewpass, setViewpass] = useState(null);
  const [tel1, setTel1] = useState(null);
  const [pack] = useState(packages[0]);
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(false);

  const [registerCompany] = useMutation(createUserBranch);

  const onCreateCompany = async () => {
    if (!password || password.length < 6) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `كلمة المرور غير صالحة - 6 احرف كحد ادنى`
          : `Password not valid, min 6 chars`
      );
      return;
    }

    if (!name || name.length < 3) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `اسم الشركة مطلوب - 3 احرف كحد ادنى`
          : `Company name is required, min 3 chars`
      );
      return;
    }
    const regex = new RegExp(phoneRegExp);
    if (!regex.test(tel1)) {
      await messageAlert(
        setAlrt,
        isRTL ? `رقم الهاتف غير صحيح` : `Phone number incurrect`
      );
      return;
    }
    if (!temp) {
      await messageAlert(
        setAlrt,
        isRTL ? `يرجى اختيار نموذج للشركة` : `Please select Company Template`
      );
      return;
    }
    setLoading(true);
    const packStart = new Date();
    const packEnd = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
    const res = await registerCompany({
      variables: {
        username: email,
        password,
        name,
        nameAr: name,
        tel1,
        packStart,
        packEnd,
        users: pack?.users,
        pack: JSON.stringify(pack),
        temp: JSON.stringify(temp),
      },
    });
    if (res?.data?.createUserBranch?.ok === false) {
      await errorAlert(setAlrt, isRTL);
      setLoading(false);
      return;
    }
    if (res?.data?.createUserBranch?.ok === true) {
      await messageShow(
        setAlrt,
        isRTL ? `تم انشاء الشركة بنجاح` : `Company Created Successfully`
      );
      setLoading(false);
      setReg(false);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TextFieldLocal
            required
            name="password"
            label={words.password}
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            type={viewpass ? undefined : 'password'}
            fullWidth
            mb={0}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            style={{
              alignItems: 'center',
              marginTop: 5,
            }}
            onClick={() => setViewpass(!viewpass)}
          >
            {viewpass && <VisibilityIcon></VisibilityIcon>}
            {!viewpass && <VisibilityOffIcon></VisibilityOffIcon>}
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <TextFieldLocal
            required
            name="name"
            ltr
            label={isRTL ? 'اسم الشركة' : 'Company Name'}
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            fullWidth
            mb={0}
          />
        </Grid>

        <Grid item xs={12}>
          <TextFieldLocal
            name="tel1"
            label={words.phoneNumber}
            value={tel1}
            onChange={(e: any) => setTel1(e.target.value)}
            fullWidth
            margin={20}
            mb={0}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            style={{
              marginTop: 10,
              marginBottom: 10,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
            variant="h5"
          >
            النماذج
          </Typography>

          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            {templates.map((tm: any) => {
              const selected = tm?.title === temp?.title;
              return (
                <Paper
                  style={{
                    width: '100%',
                    marginBottom: 10,
                    height: 40,
                    backgroundColor: selected ? '#b6fcd5' : '#f9f9f9',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTemp(tm)}
                >
                  <Typography
                    style={{
                      marginBottom: 20,
                      textAlign: 'center',
                      padding: 5,
                    }}
                    variant="subtitle1"
                    component="div"
                  >
                    {isRTL ? tm.nameAr : tm.name}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ height: 42, fontSize: 16, marginTop: 10 }}
                onClick={onCreateCompany}
                disabled={loading}
              >
                {isRTL ? 'إنشاء شركة' : 'Create Company'}
              </Button>
              {loading && <LoadingInlineButton></LoadingInlineButton>}
            </>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
