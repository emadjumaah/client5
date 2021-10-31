/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  successAlert,
  dublicateAlert,
  errorAlert,
  getReturnItem,
  yup,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';

const PopupBrand = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  theme,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { register, handleSubmit, errors, reset } = useForm(yup.brandResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const variables: any = {
      _id: row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createBrand' : 'updateBrand';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem);
      closeModal();
      await successAlert(setAlrt, isRTL);
    } catch (error) {
      onError(error);
    }
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const closeModal = () => {
    onClose();
    setSaving(false);
    reset();
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

  const title = isRTL
    ? isNew
      ? 'اضافة براند'
      : 'تعديل براند'
    : isNew
    ? 'New Brand'
    : 'Edit Brand';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        {!isRTL && (
          <Grid item xs={9}>
            <TextFieldLocal
              autoFocus
              required
              name="name"
              label={words.name}
              register={register}
              errors={errors}
              row={row}
              fullWidth
            />
            <TextFieldLocal
              required
              name="nameAr"
              label={words.nameAr}
              register={register}
              errors={errors}
              row={row}
              fullWidth
            />
          </Grid>
        )}
        {isRTL && (
          <Grid item xs={9}>
            <TextFieldLocal
              autoFocus
              required
              name="nameAr"
              label={words.name}
              register={register}
              errors={errors}
              row={row}
              fullWidth
            />
            <TextFieldLocal
              required
              name="name"
              ltr
              label={words.nameEn}
              register={register}
              errors={errors}
              row={row}
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupBrand;
