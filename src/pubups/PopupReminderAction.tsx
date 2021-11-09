/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useState } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yup } from '../Shared';

const PopupReminderAction = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
}: any) => {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm(
    yup.smsTempResolver
  );

  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const onSubmit = async (data: any) => {
    const { phone, body } = data;

    const variables: any = {
      phone,
      body,
    };

    isNew ? addAction(variables) : editAction(variables);
    reset();
    setSaving(false);
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const onCloseForem = () => {
    reset();
    onClose();
  };

  const title = isRTL
    ? isNew
      ? 'اضافة رسالة نصية'
      : 'تعديل رسالة نصية'
    : isNew
    ? 'New SMS'
    : 'Edit SMS';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForem}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={{}}
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextFieldLocal
                name="phone"
                label={words.mobile}
                register={register}
                errors={errors}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldLocal
                required
                name="body"
                multiline
                rows={4}
                label={words.body}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupReminderAction;
