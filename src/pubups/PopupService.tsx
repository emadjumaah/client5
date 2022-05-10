/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
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
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { itemTypes } from '../constants/datatypes';
// import AutoFieldLocal from '../components/fields/AutoFieldLocal';
// import { useTemplate } from '../hooks';
// import useEmployeesDown from '../hooks/useEmployeesDown';
// import useResoursesDown from '../hooks/useResoursesDown';
// import useDepartmentsDown from '../hooks/useDepartmentsDown';

const PopupService = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
  theme,
  type,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [itemType, setItemType] = useState(itemTypes[0]);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { register, handleSubmit, errors, reset } = useForm(yup.itmResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    if (type) {
      const it = itemTypes.filter((it: any) => it.id === type)?.[0];
      if (it) {
        setItemType(it);
      }
    } else {
      setItemType(itemTypes[0]);
    }
  }, [type]);

  const resetAll = () => {
    reset();
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const { price, unit, desc } = data;

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      itemType: itemType?.id,
      name,
      nameAr,
      price: Number(price),
      unit,
      desc,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createItem' : 'updateItem';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'item');

      await successAlert(setAlrt, isRTL);
      closeModal();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      resetAll();
      console.log(error);
    }
  };

  const closeModal = () => {
    onClose();
    resetAll();
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };
  const title = isRTL
    ? isNew
      ? 'خدمة جديدة'
      : 'تعديل خدمة'
    : isNew
    ? 'New Service'
    : 'Edit Service';
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
        <Grid item xs={10}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextFieldLocal
                required
                autoFocus
                name="nameAr"
                label={words.name}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                required
                name="name"
                ltr
                label={words.nameEn}
                register={register}
                errors={errors}
                row={row}
                newtext={newtext}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                name="unit"
                label={words.unit}
                register={register}
                errors={errors}
                row={row}
                newtext={newtext}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                required
                name="price"
                label={words.price}
                register={register}
                errors={errors}
                type="number"
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>

            <Grid item xs={12}>
              <AutoFieldLocal
                name="carstatus"
                title={words.type}
                words={words}
                options={itemTypes}
                value={itemType}
                setSelectValue={setItemType}
                register={register}
                isRTL={isRTL}
                fullWidth
                mb={10}
                nosort
              ></AutoFieldLocal>
            </Grid>
          </Grid>
          <TextFieldLocal
            name="desc"
            label={words.description}
            register={register}
            errors={errors}
            row={row}
            fullWidth
            multiline
            rowsMax={4}
            rows={4}
          />
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupService;
