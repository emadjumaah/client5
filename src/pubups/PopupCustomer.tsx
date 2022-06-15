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
import { Grid } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { TextFieldLocal } from '../components';
import { getPopupTitle } from '../constants/menu';
import { useTemplate } from '../hooks';
import { ImageOnlineUpload, uploadPhotoOnline } from '../common/upload';

const PopupCustomer = ({
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

  const { register, handleSubmit, errors, reset } = useForm(yup.custResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const { templateId } = useTemplate();

  useEffect(() => {
    if (row?._id) {
      if (row?.logo) {
        setLogourl(row?.logo);
      }
    }
  }, [row]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const {
      phone,
      email,
      address,
      driver,
      licenseNo,
      licenseDate,
      national,
      nationalNo,
      nationalDate,
    } = data;
    let logo: any;

    if (logoimage) {
      logo = await uploadPhotoOnline(logoimage);
      logo = logo.replace('http://', 'https://');
    }
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      phone,
      email,
      address,
      logo,
      driver,
      licenseNo,
      licenseDate,
      national,
      nationalNo,
      nationalDate,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createCustomer' : 'updateCustomer';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'customer');
      closeModal();
      await successAlert(setAlrt, isRTL);
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

  const closeModal = () => {
    onClose();
    reset();
    setSaving(false);
    setLogoimage(null);
    setLogourl(null);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = getPopupTitle('customer', isNew);

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
      // maxWidth="md"
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container spacing={1}>
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
                name="phone"
                label={words.phoneNumber}
                register={register}
                errors={errors}
                row={row}
                newtext={newtext}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={8}>
              <TextFieldLocal
                name="email"
                label={words.email}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextFieldLocal
                name="address"
                label={words.theaddress}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            {templateId === 4 && (
              <>
                <Grid item xs={12}>
                  <TextFieldLocal
                    name="driver"
                    label={words.driver}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextFieldLocal
                    name="licenseNo"
                    label={words.licenseNo}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextFieldLocal
                    name="licenseDate"
                    label={words.licenseDate}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextFieldLocal
                    name="national"
                    label={words.national}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextFieldLocal
                    name="nationalNo"
                    label={words.nationalNo}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextFieldLocal
                    name="nationalDate"
                    label={words.nationalDate}
                    register={register}
                    errors={errors}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupCustomer;
