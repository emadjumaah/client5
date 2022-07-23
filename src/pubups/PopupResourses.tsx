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
  ColorPicker,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Divider, TextField } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { getPopupTitle } from '../constants/menu';
import { carstatuss } from '../constants';
import useRetypes from '../hooks/useRetypes';
import PopupResourseType from './PopupResourseType';
import { uploadMultiPhotoOnline } from '../common/AvatarUpload';
import { ImageView } from '../components/viewer';
import { UploadPhotos } from '../common/UploadPhotos';

const PopupResourses = ({
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
  const [rtypevalue, setRtypevalue] = useState<any>(null);
  const [statusvalue, setStatusvalue] = useState<any>(null);
  const [depError, setDepError] = useState<any>(false);
  const [color, setColor] = useState<any>('#252B3B');

  const [newtext2, setNewtext2] = useState('');
  const [openTyp, setOpenTyp] = useState(false);

  const [urls, setUrls] = useState([]);
  const [photosimages, setPhotosimages] = useState([]);
  const [photosurls, setPhotosurls] = useState([]);

  const emplRef: any = React.useRef();

  const { retypes, addRetype, editRetype } = useRetypes();

  const { register, handleSubmit, errors, reset } = useForm(yup.emppResolver);
  const {
    translate: { words, isRTL },
    store: { user, tempId },
  }: GContextTypes = useContext(GlobalContext);
  const openRetype = () => {
    setOpenTyp(true);
  };
  const onCloseRetype = () => {
    setOpenTyp(false);
    setNewtext2('');
  };
  const onNewTypChange = (nextValue: any) => {
    setRtypevalue(nextValue);
  };

  useEffect(() => {
    if (row && row._id) {
      const _id = row.retypeId;
      if (_id) {
        const depart = retypes.filter((dep: any) => dep._id === _id)[0];
        setRtypevalue(depart);
      }

      const status = row?.carstatus;
      if (status) {
        const sts = carstatuss.filter((dep: any) => dep.id === status)?.[0];
        setStatusvalue(sts);
      }
      if (row.photos) {
        const phs = JSON.parse(row.photos);
        if (phs && phs.length > 0) {
          setPhotosurls(phs);
        }
      }
      setColor(row.color);
    }
  }, [row]);

  useEffect(() => {
    let locals = [];
    let online = [];
    if (photosimages && photosimages.length > 0) {
      for (const img of photosimages) {
        const localimage = URL.createObjectURL(img);
        locals.push(localimage);
      }
    } else {
      locals = [];
    }
    if (photosurls && photosurls.length > 0) {
      online = photosurls;
    } else {
      online = [];
    }
    setUrls([...online, ...locals]);
  }, [photosimages, photosurls]);

  const addToPhotos = (photos: any) => {
    const lphotos = [...photosimages];
    const li = photosimages.length;
    const oi = photosurls.length;
    const n = 10 - (oi + li);
    if (n < 1 || !photos || photos.length === 0) {
      return;
    } else {
      const newphotos = [...lphotos, ...photos];
      const fnewphotos = newphotos.slice(0, n);
      setPhotosimages(fnewphotos);
    }
  };
  const removePhoto = (src: any, index: any) => {
    if (src.startsWith('http')) {
      const newphotosurls = [...photosurls];
      const newlist = newphotosurls.filter((nu: any) => nu !== src);
      setPhotosurls(newlist);
    } else {
      const newList = [...photosimages];
      const newindex = index - photosurls.length;
      newList.splice(newindex, 1);
      setPhotosimages(newList);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = !isNew ? data.nameAr.trim() : name;
    const {
      info,
      brand,
      plate,
      cost,
      model,
      purtime,
      insurance,
      licenseDate,
      address,
    } = data;

    let localphotos = [];

    if (photosimages) {
      const photosurl = await uploadMultiPhotoOnline(photosimages);
      if (photosurl && photosurl.length > 0) {
        const rphotos = photosurl.map((photo: any) =>
          photo.replace('http://', 'https://')
        );
        localphotos = rphotos;
      }
    }

    const fphotos = [...photosurls, ...localphotos];
    const photos = JSON.stringify(fphotos);

    const retype = rtypevalue
      ? {
          retypeId: rtypevalue._id,
          retypeName: rtypevalue.name,
          retypeNameAr: rtypevalue.nameAr,
          retypeColor: rtypevalue.color,
        }
      : {
          retypeId: undefined,
          retypeName: undefined,
          retypeNameAr: undefined,
          retypeColor: undefined,
        };
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      resType: 1,
      color,
      photos: fphotos && fphotos.length > 0 ? photos : null,
      brand,
      plate,
      cost: Number(cost),
      model,
      info,
      purtime,
      insurance,
      licenseDate,
      retype,
      address,
      carstatus: statusvalue?.id,
      branch: user.branch,
      userId: user._id,
    };

    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createResourse' : 'updateResourse';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'resourse');
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
      resetAll();
      console.log(error);
    }
  };

  const resetAll = () => {
    reset();
    setRtypevalue(null);
    setColor('#000000');
    setStatusvalue(carstatuss[0]);
    setSaving(false);
    setPhotosimages([]);
    setUrls([]);
    setPhotosurls([]);
  };
  const closeModal = () => {
    resetAll();
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = getPopupTitle('resourse', isNew);
  const isCar = tempId === 9 || tempId === 4;
  const isRes = tempId === 7;
  const isSer = tempId === 2 || tempId === 5 || tempId === 8;
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      mb={50}
      maxWidth="md"
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={6}>
          <Grid container spacing={1}>
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
            {(isCar || isSer) && (
              <Grid item xs={4}>
                <TextFieldLocal
                  name="plate"
                  label={words.plate}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {(isCar || isSer) && (
              <Grid item xs={4}>
                <TextFieldLocal
                  name="brand"
                  label={words.brand}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {(isCar || isSer) && (
              <Grid item xs={4}>
                <TextFieldLocal
                  name="model"
                  label={words.model}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {(isCar || isSer) && (
              <Grid item xs={6}>
                <TextFieldLocal
                  name="cost"
                  label={words.cost}
                  register={register}
                  errors={errors}
                  row={row}
                  type="number"
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {(isCar || isSer) && (
              <Grid item xs={6}>
                <TextFieldLocal
                  name="purtime"
                  label={words.purtime}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {isCar && (
              <Grid item xs={6}>
                <TextFieldLocal
                  name="insurance"
                  label={words.insurance}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {isCar && (
              <Grid item xs={6}>
                <TextFieldLocal
                  name="licenseDate"
                  label={words.expiretime}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
            )}
            {isRes && (
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
            )}
            <Grid item xs={12}>
              <AutoFieldLocal
                name="retype"
                title={words?.retype}
                words={words}
                options={retypes.filter((dep: any) => dep.reType === 2)}
                value={rtypevalue}
                setSelectValue={setRtypevalue}
                setSelectError={setDepError}
                selectError={depError}
                refernce={emplRef}
                register={register}
                openAdd={openRetype}
                isRTL={isRTL}
                fullWidth
                mb={0}
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={12}>
              <AutoFieldLocal
                name="carstatus"
                title={words.status}
                words={words}
                options={carstatuss.filter((cs: any) =>
                  isRes ? cs.id !== 10 && cs.id !== 3 : cs.id !== 10
                )}
                value={statusvalue}
                setSelectValue={setStatusvalue}
                register={register}
                isRTL={isRTL}
                fullWidth
                disabled={row?.carstatus === 10}
                mb={0}
                nosort
              ></AutoFieldLocal>
            </Grid>

            <Grid item xs={12}>
              <TextFieldLocal
                name="info"
                label={words.info}
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
        <Grid item xs={4}>
          <Grid container spacing={1}>
            <Grid item xs={8} style={{ marginRight: 15 }}>
              <Box
                style={{
                  height: 300,
                  width: 200,
                  margin: 5,
                }}
              >
                <ImageView
                  images={urls}
                  removePhoto={removePhoto}
                  width={200}
                  height={300}
                ></ImageView>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  flex: 1,
                  height: 40,
                  width: 200,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 5,
                }}
              >
                <UploadPhotos
                  setImages={addToPhotos}
                  isRTL={isRTL}
                ></UploadPhotos>
              </Box>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{ paddingLeft: 20, paddingRight: 20 }}
          >
            <Grid item xs={12} style={{ marginTop: 10 }}>
              <Divider></Divider>
            </Grid>

            <Grid item xs={6}>
              <TextField
                disabled
                name="color"
                value={row?.color ? row.color : color}
                variant="outlined"
                style={{
                  width: 200,
                  backgroundColor: color,
                  marginTop: 10,
                }}
                InputProps={{ style: { borderRadius: 5, color: '#fff' } }}
                margin="dense"
              />
              <ColorPicker setColor={setColor} color={color}></ColorPicker>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        <PopupResourseType
          newtext={newtext2}
          open={openTyp}
          onClose={onCloseRetype}
          isNew={true}
          setNewValue={onNewTypChange}
          row={null}
          addAction={addRetype}
          editAction={editRetype}
          reType={2}
        ></PopupResourseType>
      </Grid>
    </PopupLayout>
  );
};

export default PopupResourses;
