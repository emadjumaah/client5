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
import { Grid } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { TextFieldLocal } from '../components';

const PopupSupplier = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
  theme,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { register, handleSubmit, errors, reset } = useForm(yup.custResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const { phone, email } = data;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      phone,
      email,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createSupplier' : 'updateSupplier';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'supplier');
      await successAlert(setAlrt, isRTL);
      closeModal();
      onClose();
    } catch (error) {
      onError(error);
    }
  };

  const closeModal = () => {
    onClose();
    reset();
    setSaving(false);
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

  const title = isRTL
    ? isNew
      ? 'اضافة مورد'
      : 'تعديل بيانات مورد'
    : isNew
    ? 'New Supplier'
    : 'Edit Supplier';

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
        <Grid item xs={9}>
          {isRTL && (
            <React.Fragment>
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
                label={words.nameEn}
                register={register}
                errors={errors}
                row={row}
                fullWidth
              />
            </React.Fragment>
          )}
          {!isRTL && (
            <React.Fragment>
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
            </React.Fragment>
          )}
          <TextFieldLocal
            required
            name="phone"
            label={words.phoneNumber}
            register={register}
            errors={errors}
            row={row}
            newtext={newtext}
            fullWidth
          />
          <TextFieldLocal
            name="email"
            label={words.email}
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

export default PopupSupplier;
