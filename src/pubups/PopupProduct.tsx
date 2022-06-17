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
import { ImageOnlineUpload, uploadPhotoOnline } from '../common/upload';

const PopupProduct = ({
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
  const [logoimage, setLogoimage] = useState(null);
  const [logourl, setLogourl] = useState(null);
  const { register, handleSubmit, errors, reset } = useForm(yup.itmResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    if (row?._id) {
      if (row?.photo) {
        setLogourl(row?.photo);
      }
    }
  }, [row]);

  const resetAll = () => {
    reset();
    setLogoimage(null);
    setLogourl(null);
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const { cost, price, unit, desc } = data;
    let photo: any;

    if (logoimage) {
      photo = await uploadPhotoOnline(logoimage);
      photo = photo.replace('http://', 'https://');
    }
    const variables: any = {
      _id: row && row._id ? row._id : undefined,
      itemType: 1,
      name,
      nameAr,
      price: Number(price),
      cost: Number(cost),
      unit,
      desc,
      photo,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createItem' : 'updateItem';
    await apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'item');
      setSaving(false);
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
      reset();
      console.log(error);
    }
  };

  const closeModal = () => {
    resetAll();
    onClose();
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };
  const title = isRTL
    ? isNew
      ? 'منتج جدبد'
      : 'تعديل منتج'
    : isNew
    ? 'New Product'
    : 'Edit Product';

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
            <Grid item xs={4}>
              <ImageOnlineUpload
                url={logourl}
                setUrl={setLogourl}
                image={logoimage}
                setImage={setLogoimage}
                width={150}
                height={150}
                size="400x400"
              ></ImageOnlineUpload>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} style={{ marginTop: 20 }}>
                  <TextFieldLocal
                    autoFocus
                    required
                    name="nameAr"
                    label={words.name}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextFieldLocal
                    required
                    name="name"
                    ltr
                    label={words.nameEn}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <TextFieldLocal
                required
                name="cost"
                label={words.cost}
                register={register}
                errors={errors}
                type="number"
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupProduct;
