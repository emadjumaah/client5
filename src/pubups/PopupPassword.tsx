/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { successAlert, dublicateAlert, errorAlert, yup } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';
import { errorAlertMsg } from '../Shared/helpers';

const PopupPassword = ({ open, onClose, row, editPassword, theme }: any) => {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { register, handleSubmit, errors, reset } = useForm(yup.passResolver);
  const {
    translate: { isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const onSubmit = async (data: any) => {
    const newPassword = data.newPassword;
    const newPassword2 = data.newPassword2;

    if (newPassword !== newPassword2) {
      await errorAlertMsg(setAlrt, 'password not match');
      return;
    }

    const variables: any = {
      _id: row._id,
      password: newPassword,
    };
    try {
      const res = await editPassword({ variables });
      if (res?.data?.changePassword?.ok === true) {
        await successAlert(setAlrt, isRTL);
      } else if (res?.data?.changePassword?.ok === false) {
        await errorAlertMsg(setAlrt, res?.data?.changePassword?.error);
        return;
      }
      reset();
      onClose();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      reset();
      console.log(error);
    }
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = isRTL ? 'تعديل كلمة المرور' : 'Change Password';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      maxWidth="xs"
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <TextFieldLocal
            required
            type="password"
            name="newPassword"
            label={isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
            register={register}
            errors={errors}
            row={row}
            fullWidth
          />
          <TextFieldLocal
            required
            type="password"
            name="newPassword2"
            label={isRTL ? 'تكرار كلمة المرور الجديدة' : 'New Password Again'}
            register={register}
            errors={errors}
            row={row}
            fullWidth
          />
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupPassword;
