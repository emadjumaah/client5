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
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { useCustomers, useTemplate } from '../hooks';
import { weekdaysNNo } from '../constants/datatypes';
import PopupCustomer from './PopupCustomer';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';

const PopupProject = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
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

  const [newtext2, setNewtext2] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const { register, handleSubmit, errors, reset } = useForm(yup.departResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const { addCustomer, editCustomer } = useCustomers();
  const { addDepartment, editDepartment } = useDepartmentsUp();
  const { addEmployee, editEmployee } = useEmployeesUp();
  const { addResourse, editResourse } = useResoursesUp();
  const { tempoptions, tempwords } = useTemplate();

  useEffect(() => {
    if (row && row._id) {
      const custId = row.customerId;
      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;
      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (empId) {
        const empl = employees.filter((emp: any) => emp._id === empId)[0];
        setEmplvalue(empl);
      }
      if (resId) {
        const reso = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(reso);
      }
      if (custId) {
        const reso = customers.filter((emp: any) => emp._id === custId)[0];
        setCustvalue(reso);
      }
    }
  }, [row]);

  const openDepartment = () => {
    setOpenDep(true);
  };
  const onCloseDepartment = () => {
    setOpenDep(false);
    setNewtext2('');
  };
  const openEmployee = () => {
    setOpenEmp(true);
  };
  const onCloseEmploee = () => {
    setOpenEmp(false);
    setNewtext2('');
  };
  const openResourse = () => {
    setOpenRes(true);
  };
  const onCloseResourse = () => {
    setOpenRes(false);
    setNewtext2('');
  };
  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext2('');
  };

  const onNewCustChange = (nextValue: any) => {
    setCustvalue(nextValue);
  };
  const onNewDepartChange = (nextValue: any) => {
    setDepartvalue(nextValue);
  };
  const onNewEmplChange = (nextValue: any) => {
    setEmplvalue(nextValue);
  };
  const onNewResoChange = (nextValue: any) => {
    setResovalue(nextValue);
  };

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
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createProject' : 'updateProject';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'project');
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
      console.log(error);
    }
  };

  const onCloseForm = () => {
    onClose();
    reset();
    setSaving(false);
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
    setCustvalue(null);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const date = row?.start ? new Date(row?.start) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = getPopupTitle('project', isNew);

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
                ltr
                label={words.nameEn}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={12}>
              <AutoFieldLocal
                name="customer"
                title={tempwords?.customer}
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
                openAdd={openCustomer}
                showphone
              ></AutoFieldLocal>
            </Grid>
            {!tempoptions?.noEmp && (
              <Grid item xs={12}>
                <AutoFieldLocal
                  name="employee"
                  title={tempwords?.employee}
                  words={words}
                  options={employees}
                  value={emplvalue}
                  setSelectValue={setEmplvalue}
                  setSelectError={setEmplError}
                  selectError={emplError}
                  refernce={emplRef}
                  register={register}
                  openAdd={openEmployee}
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
                  title={tempwords?.resourse}
                  words={words}
                  options={resourses}
                  value={resovalue}
                  setSelectValue={setResovalue}
                  setSelectError={setResoError}
                  selectError={resoError}
                  refernce={resoRef}
                  register={register}
                  openAdd={openResourse}
                  isRTL={isRTL}
                  fullWidth
                  day={day}
                ></AutoFieldLocal>
              </Grid>
            )}
            <Grid item xs={12}>
              <AutoFieldLocal
                name="department"
                title={tempwords?.department}
                words={words}
                options={departments}
                value={departvalue}
                setSelectValue={setDepartvalue}
                setSelectError={setDepartError}
                selectError={departError}
                refernce={departRef}
                register={register}
                openAdd={openDepartment}
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
        </Grid>
        <Grid item xs={1}></Grid>
        <PopupCustomer
          newtext={newtext2}
          open={openCust}
          onClose={onCloseCustomer}
          isNew={true}
          setNewValue={onNewCustChange}
          row={null}
          addAction={addCustomer}
          editAction={editCustomer}
        ></PopupCustomer>
        <PopupDeprtment
          newtext={newtext2}
          open={openDep}
          onClose={onCloseDepartment}
          isNew={true}
          setNewValue={onNewDepartChange}
          row={null}
          addAction={addDepartment}
          editAction={editDepartment}
          depType={1}
        ></PopupDeprtment>

        <PopupEmployee
          newtext={newtext2}
          departments={departments}
          open={openEmp}
          onClose={onCloseEmploee}
          isNew={true}
          setNewValue={onNewEmplChange}
          row={null}
          resType={1}
          addAction={addEmployee}
          editAction={editEmployee}
        ></PopupEmployee>
        <PopupResourses
          newtext={newtext2}
          departments={departments}
          open={openRes}
          onClose={onCloseResourse}
          isNew={true}
          setNewValue={onNewResoChange}
          row={null}
          resType={1}
          addAction={addResourse}
          editAction={editResourse}
        ></PopupResourses>
      </Grid>
    </PopupLayout>
  );
};

export default PopupProject;
