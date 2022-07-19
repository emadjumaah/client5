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
import { TextField } from '@material-ui/core';
import DaysOffView from '../Shared/DaysOffView';
import { weekdays } from '../constants/datatypes';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { getPopupTitle } from '../constants/menu';
import PopupResourseType from './PopupResourseType';
import useRetypes from '../hooks/useRetypes';

const PopupEmployee = ({
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
  const [depError, setDepError] = useState<any>(false);
  const [color, setColor] = useState<any>('#252B3B');
  const [daysoff, setDaysoff] = React.useState(weekdays);

  const [newtext2, setNewtext2] = useState('');

  const [openTyp, setOpenTyp] = useState(false);

  const { retypes, addRetype, editRetype } = useRetypes();

  const daysoffChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysoff({ ...daysoff, [event.target.name]: event.target.checked });
  };

  const emplRef: any = React.useRef();

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
      if (row.daysoff) {
        setDaysoff(JSON.parse(row.daysoff));
      }
      setColor(row.color);
    }
  }, [row]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = !isNew ? data.nameAr.trim() : name;
    const phone = data.phone;
    const email = data.email;
    const info = data.info;
    const {
      telHome,
      workId,
      national,
      nationalNo,
      nationalDate,
      licenseNo,
      licenseDate,
    } = data;

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
      email,
      color,
      info,
      daysoff: JSON.stringify(daysoff),
      phone,
      telHome,
      workId,
      national,
      nationalNo,
      nationalDate,
      licenseNo,
      licenseDate,
      retype,
      branch: user.branch,
      userId: user._id,
    };

    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createEmployee' : 'updateEmployee';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'employee');
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
    setDaysoff(weekdays);
    setSaving(false);
  };
  const closeModal = () => {
    resetAll();
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = getPopupTitle('employee', isNew);
  const isCar = tempId === 9 || tempId === 4;
  // const isRes = tempId === 7;
  // const isSer = tempId === 2 || tempId === 5 || tempId === 8;
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
      saving={saving}
    >
      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
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
                margin={20}
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
                name="phone"
                label={words.phoneNumber}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                margin={20}
                mb={0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                name="telHome"
                label={words.telHome}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                margin={20}
                mb={0}
              />
            </Grid>
            {isCar && (
              <Grid item xs={6}>
                <TextFieldLocal
                  name="workId"
                  label={words.workId}
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
                  name="national"
                  label={words.national}
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
            {isCar && (
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
            )}
            {isCar && (
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
            )}
            <Grid item xs={12}>
              <TextFieldLocal
                name="email"
                label={words.email}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                margin={20}
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <AutoFieldLocal
                name="retype"
                title={words?.retype}
                words={words}
                options={retypes.filter((dep: any) => dep.reType === 1)}
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
                mb={0}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ padding: 20 }}>
            <Grid item xs={6}>
              <DaysOffView
                isRTL={isRTL}
                daysoff={daysoff}
                daysoffChange={daysoffChange}
              ></DaysOffView>
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
                  marginTop: 20,
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
          reType={1}
        ></PopupResourseType>
      </Grid>
    </PopupLayout>
  );
};

export default PopupEmployee;
