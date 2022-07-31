/* eslint-disable react-hooks/exhaustive-deps */
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
import { Grid, TextField } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { TextFieldLocal } from '../components';
import { retypeTypes } from '../constants/datatypes';
import FilterSelectSingle from '../Shared/FilterSelectSingle';

const PopupResourseType = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  theme,
  reType,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [retype, setRetype] = useState(retypeTypes[0]);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { register, handleSubmit, errors, reset } = useForm(yup.departResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [color, setColor] = useState<any>('#AAAAAA');
  useEffect(() => {
    if (row && row._id) {
      setColor(row.color);
      if (row?.reType) {
        const dep = retypeTypes.filter((de: any) => de.id === row?.reType);
        if (dep && dep.length > 0) {
          setRetype(dep[0]);
        }
      }
    }
  }, [row]);
  useEffect(() => {
    if (isNew && reType) {
      const ret = retypeTypes.filter((de: any) => de.id === reType)?.[0];
      if (ret) setRetype(ret);
    }
  }, [reType]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = !isNew ? data.nameAr.trim() : name;
    const desc = data.desc;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      reType: retype ? retype.id : undefined,
      desc,
      color,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createRetype' : 'updateRetype';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'retype');
      setSaving(false);
      await successAlert(setAlrt, isRTL);
      onCloseForm();
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
      setColor('#AAAAAA');
      console.log(error);
    }
  };

  const onCloseForm = () => {
    onClose();
    reset();
    setColor('#AAAAAA');
    setSaving(false);
    setRetype(retypeTypes[0]);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };
  const title = isRTL ? 'نوع' : 'Type';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FilterSelectSingle
                options={retypeTypes}
                value={retype}
                setValue={setRetype}
                words={words}
                isRTL={isRTL}
                name="reType"
                disabled={reType}
              ></FilterSelectSingle>
            </Grid>
            <Grid item xs={12}>
              <TextFieldLocal
                autoFocus
                required
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
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                disabled
                name="color"
                value={row?.color ? row.color : color}
                variant="outlined"
                style={{
                  backgroundColor: color,
                  width: 200,
                  marginLeft: 20,
                  marginRight: 20,
                }}
                InputProps={{
                  style: { borderRadius: 5, color: '#fff' },
                }}
                margin="dense"
              />
            </Grid>
            <Grid item xs={8}>
              <ColorPicker setColor={setColor} color={color}></ColorPicker>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupResourseType;
