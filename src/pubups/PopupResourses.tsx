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
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { useDepartments, useTemplate } from '../hooks';
import { getPopupTitle } from '../constants/menu';

const PopupResourses = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
  theme,
  resType,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [departvalue, setDepartvalue] = useState<any>(null);
  const [depError, setDepError] = useState<any>(false);
  const [color, setColor] = useState<any>('#000000');

  const emplRef: any = React.useRef();
  const { tempwords } = useTemplate();

  const { register, handleSubmit, errors, reset } = useForm(yup.emppResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const { departments } = useDepartments();

  useEffect(() => {
    if (row && row._id) {
      const _id = row.departmentId;
      const depart = departments.filter((dep: any) => dep._id === _id)[0];
      setDepartvalue(depart);
      setColor(row.color);
    }
  }, [row]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const info = data.info;
    const department = departvalue
      ? {
          departmentId: departvalue._id,
          departmentName: departvalue.name,
          departmentNameAr: departvalue.nameAr,
          departmentColor: departvalue.color,
        }
      : {
          departmentId: undefined,
          departmentName: undefined,
          departmentNameAr: undefined,
          departmentColor: undefined,
        };
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      resType,
      color,
      info,
      department,
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
    setDepartvalue(null);
    setColor('#000000');
  };
  const closeModal = () => {
    onClose();
    resetAll();
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = getPopupTitle('resourse', isNew);

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
                margin={20}
                mb={10}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                required
                name="name"
                label={words.nameEn}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                newtext={newtext}
                margin={20}
                mb={10}
              />
            </Grid>
          </Grid>
          <React.Fragment>
            <AutoFieldLocal
              name="department"
              title={tempwords.department}
              words={words}
              options={departments.filter(
                (dep: any) => dep.depType === resType
              )}
              value={departvalue}
              setSelectValue={setDepartvalue}
              setSelectError={setDepError}
              selectError={depError}
              refernce={emplRef}
              register={register}
              // openAdd={openDepartment}
              isRTL={isRTL}
              fullWidth
              mb={20}
            ></AutoFieldLocal>
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
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <TextField
                  disabled
                  name="color"
                  value={row?.color ? row.color : color}
                  variant="outlined"
                  style={{ width: 200, backgroundColor: color }}
                  InputProps={{ style: { borderRadius: 5, color: '#fff' } }}
                  margin="dense"
                />
                <ColorPicker setColor={setColor} color={color}></ColorPicker>
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupResourses;
