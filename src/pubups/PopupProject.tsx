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
import { Grid, TextField } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { TextFieldLocal } from '../components';
import { getPopupTitle } from '../constants/menu';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { useTemplate } from '../hooks';
import { weekdaysNNo } from '../constants/datatypes';

const PopupProject = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
  theme,
  employees,
  departments,
  resourses,
  customers,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();
  const [resovalue, setResovalue] = useState<any>(null);
  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = React.useRef();

  const [custvalue, setCustvalue] = useState<any>(null);
  const [custError, setCustError] = useState<any>(false);
  const custRef: any = React.useRef();

  const { register, handleSubmit, errors, reset } = useForm(yup.departResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [color, setColor] = useState<any>('#252B3B');

  const { tempoptions, tempwords } = useTemplate();

  useEffect(() => {
    if (row && row._id) {
      setColor(row.color);
    }
  }, [row]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const desc = data.desc;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      customer: custvalue
        ? {
            customerId: custvalue._id,
            customerName: custvalue.name,
            customerNameAr: custvalue.nameAr,
            customerPhone: custvalue.phone,
          }
        : {
            customerId: undefined,
            customerName: undefined,
            customerNameAr: undefined,
            customerPhone: undefined,
          },

      department: departvalue
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
          },
      employee: emplvalue
        ? {
            employeeId: emplvalue._id,
            employeeName: emplvalue.name,
            employeeNameAr: emplvalue.nameAr,
            employeeColor: emplvalue.color,
            employeePhone: emplvalue.phone,
          }
        : {
            employeeId: undefined,
            employeeName: undefined,
            employeeNameAr: undefined,
            employeeColor: undefined,
          },
      resourse: resovalue
        ? {
            resourseId: resovalue._id,
            resourseName: resovalue.name,
            resourseNameAr: resovalue.nameAr,
            resourseColor: resovalue.color,
          }
        : {
            employeeId: undefined,
            employeeName: undefined,
            employeeNameAr: undefined,
            employeeColor: undefined,
            employeePhone: undefined,
          },
      desc,
      color,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createDepartment' : 'updateDepartment';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem);
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
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const date = row?.start ? new Date(row?.start) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = getPopupTitle('department', isNew);

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
            <Grid item xs={6}>
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
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <AutoFieldLocal
                name="customer"
                title={tempwords.customer}
                words={words}
                options={customers}
                value={custvalue}
                setSelectValue={setCustvalue}
                setSelectError={setCustError}
                selectError={custError}
                refernce={custRef}
                register={register}
                isRTL={isRTL}
                fullWidth
                showphone
              ></AutoFieldLocal>
            </Grid>
            {!tempoptions?.noEmp && (
              <Grid item xs={12}>
                <AutoFieldLocal
                  name="employee"
                  title={tempwords.employee}
                  words={words}
                  options={employees}
                  value={emplvalue}
                  setSelectValue={setEmplvalue}
                  setSelectError={setEmplError}
                  selectError={emplError}
                  refernce={emplRef}
                  register={register}
                  noPlus
                  isRTL={isRTL}
                  fullWidth
                  day={day}
                ></AutoFieldLocal>
              </Grid>
            )}
            {!tempoptions?.noRes && (
              <Grid item xs={12}>
                <AutoFieldLocal
                  name="resourse"
                  title={tempwords.resourse}
                  words={words}
                  options={resourses}
                  value={resovalue}
                  setSelectValue={setResovalue}
                  setSelectError={setResoError}
                  selectError={resoError}
                  refernce={resoRef}
                  register={register}
                  noPlus
                  isRTL={isRTL}
                  fullWidth
                  day={day}
                ></AutoFieldLocal>
              </Grid>
            )}
            <Grid item xs={12}>
              <AutoFieldLocal
                name="department"
                title={tempwords.department}
                words={words}
                options={departments}
                value={departvalue}
                setSelectValue={setDepartvalue}
                setSelectError={setDepartError}
                selectError={departError}
                refernce={departRef}
                register={register}
                noPlus
                isRTL={isRTL}
                fullWidth
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

export default PopupProject;
