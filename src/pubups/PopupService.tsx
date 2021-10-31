/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useState } from 'react';
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
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  // const [departvalue, setDepartvalue] = useState<any>(null);
  // const [departError, setDepartError] = useState<any>(false);
  // const departRef: any = React.useRef();

  // const [emplvalue, setEmplvalue] = useState<any>(null);
  // const [emplError, setEmplError] = useState<any>(false);
  // const emplRef: any = React.useRef();

  // const [resovalue, setResovalue] = useState<any>(null);
  // const [resoError, setResoError] = useState<any>(false);
  // const resoRef: any = React.useRef();

  // const [emplslist, setEmplslist] = useState<any>([]);

  const { register, handleSubmit, errors, reset } = useForm(yup.itmResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  // const { tempoptions, tempwords } = useTemplate();
  // const { departments } = useDepartmentsDown();
  // const { employees } = useEmployeesDown();
  // const { resourses } = useResoursesDown();

  // useEffect(() => {
  //   if (employees && employees.length > 0) {
  //     const filtered = employees.filter((emp: any) => emp.resType === 2);
  //     setEmplslist(filtered);
  //   }
  // }, [employees]);

  // useEffect(() => {
  //   if (row && row._id) {
  //     const depId = row.departmentId;
  //     const empId = row.employeeId;
  //     const resId = row.resourseId;
  //     // const catId = row.categoryId;
  //     if (depId) {
  //       const depart = departments.filter((dep: any) => dep._id === depId)[0];
  //       setDepartvalue(depart);
  //     }
  //     if (empId) {
  //       const empl = employees.filter((emp: any) => emp._id === empId)[0];
  //       setEmplvalue(empl);
  //     }
  //     if (resId) {
  //       const reso = resourses.filter((emp: any) => emp._id === resId)[0];
  //       setResovalue(reso);
  //     }
  //   }
  // }, [row]);

  const resetAll = () => {
    reset();
    // setDepartvalue(null);
    // setDepartError(false);
    // setEmplvalue(null);
    // setEmplError(false);
    // setResovalue(null);
    // setResoError(false);
    // setEmplslist([]);
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const { price, unit, desc } = data;
    // const department = departvalue
    //   ? {
    //       departmentId: departvalue._id,
    //       departmentName: departvalue.name,
    //       departmentNameAr: departvalue.nameAr,
    //       departmentColor: departvalue.color,
    //     }
    //   : {
    //       departmentId: undefined,
    //       departmentName: undefined,
    //       departmentNameAr: undefined,
    //       departmentColor: undefined,
    //     };
    // const employee = emplvalue
    //   ? {
    //       employeeId: emplvalue._id,
    //       employeeName: emplvalue.name,
    //       employeeNameAr: emplvalue.nameAr,
    //       employeeColor: emplvalue.color,
    //     }
    //   : {
    //       employeeId: undefined,
    //       employeeName: undefined,
    //       employeeNameAr: undefined,
    //       employeeColor: undefined,
    //     };
    // const resourse = resovalue
    //   ? {
    //       resourseId: resovalue._id,
    //       resourseName: resovalue.name,
    //       resourseNameAr: resovalue.nameAr,
    //       resourseColor: resovalue.color,
    //     }
    //   : {
    //       resourseId: undefined,
    //       resourseName: undefined,
    //       resourseNameAr: undefined,
    //       resourseColor: undefined,
    //     };
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      itemType: 2,
      name,
      nameAr,
      price,
      unit,
      desc,
      // department,
      // employee,
      // resourse,
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
                required
                name="price"
                label={words.price}
                register={register}
                errors={errors}
                type="number"
                row={row}
                fullWidth
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
          </Grid>

          {/* {!tempoptions?.noServDep && (
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
              isRTL={isRTL}
              mb={20}
            ></AutoFieldLocal>
          )}

          {!tempoptions?.noServEmp && (
            <AutoFieldLocal
              name="employee"
              title={tempwords.employee}
              words={words}
              options={emplslist}
              value={emplvalue}
              setSelectValue={setEmplvalue}
              setSelectError={setEmplError}
              selectError={emplError}
              refernce={emplRef}
              register={register}
              isRTL={isRTL}
              mb={20}
            ></AutoFieldLocal>
          )}
          {!tempoptions?.noServRes && (
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
              isRTL={isRTL}
              mb={20}
            ></AutoFieldLocal>
          )} */}
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
