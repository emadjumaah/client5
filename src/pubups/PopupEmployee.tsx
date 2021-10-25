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
import { useDepartments } from '../hooks';
import { getPopupTitle } from '../constants/menu';

const PopupEmployee = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
  theme,
  resKind,
  resType,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [departvalue, setDepartvalue] = useState<any>(null);
  const [depError, setDepError] = useState<any>(false);
  const [color, setColor] = useState<any>('#000000');
  const [daysoff, setDaysoff] = React.useState(weekdays);

  const daysoffChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysoff({ ...daysoff, [event.target.name]: event.target.checked });
  };

  const emplRef: any = React.useRef();

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
      if (row.daysoff) {
        setDaysoff(JSON.parse(row.daysoff));
      }
      setDepartvalue(depart);
      setColor(row.color);
    }
  }, [row]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const phone = data.phone;
    const email = data.email;
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
      resKind,
      resType,
      email,
      color,
      info,
      daysoff: JSON.stringify(daysoff),
      phone,
      department,
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
    setDepartvalue(null);
    setColor('#000000');
    setDaysoff(weekdays);
    setSaving(false);
  };
  const closeModal = () => {
    onClose();
    resetAll();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = getPopupTitle('employee', isNew);

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
          <Grid container spacing={1}>
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
                mb={0}
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
                mb={0}
              />
            </Grid>
          </Grid>

          <TextFieldLocal
            name="phone"
            label={words.phoneNumber}
            register={register}
            errors={errors}
            row={row}
            fullWidth
            margin={20}
            mb={10}
          />
          <TextFieldLocal
            name="email"
            label={words.email}
            register={register}
            errors={errors}
            row={row}
            fullWidth
            margin={20}
            mb={10}
          />
          <AutoFieldLocal
            name="department"
            title={words.department}
            words={words}
            options={departments.filter((dep: any) => dep.depType === resType)}
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
                style={{ width: 200, backgroundColor: color }}
                InputProps={{ style: { borderRadius: 5, color: '#fff' } }}
                margin="dense"
              />
              <ColorPicker setColor={setColor} color={color}></ColorPicker>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupEmployee;
