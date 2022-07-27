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
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import { TextFieldLocal } from '../components';
import { useTemplate } from '../hooks';

const PopupExpenseItem = ({
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
  const [isSalary, setIsSalary] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { templateId } = useTemplate();
  const { register, handleSubmit, errors, reset } = useForm(yup.expitmResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const resetAll = () => {
    reset();
  };

  useEffect(() => {
    if (row?._id) {
      setIsSalary(row?.isSalary);
    }
  }, [row]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = !isNew ? data.nameAr.trim() : name;
    const { price, unit, desc } = data;

    const variables: any = {
      _id: row && row._id ? row._id : undefined,
      itemType: 10,
      name,
      nameAr,
      price: Number(price),
      unit,
      isSalary,
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
    setIsSalary(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const isDel = templateId === 9;
  const title = isRTL
    ? isNew
      ? 'مصروف جديدة'
      : 'تعديل مصروف'
    : isNew
    ? 'New Expenses Item'
    : 'Edit Expenses Item';
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
            <Grid item xs={12}>
              <TextFieldLocal
                required
                autoFocus
                name="name"
                label={words.name}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            {!isNew && (
              <Grid item xs={12}>
                <TextFieldLocal
                  required
                  name="nameAr"
                  label={words.nameAr}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextFieldLocal
                name="price"
                label={words.theprice}
                register={register}
                errors={errors}
                type="number"
                row={row}
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
            <Grid item xs={12}>
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
            {isDel && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ padding: 7 }}
                      checked={isSalary}
                      onChange={() => {
                        setIsSalary(!isSalary);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      color="primary"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      {isRTL ? 'مستقطع الراتب' : 'Salary Deduction'}
                    </Typography>
                  }
                  style={{ fontSize: 14 }}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupExpenseItem;
