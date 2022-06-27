/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  dublicateAlert,
  errorAlert,
  messageAlert,
  successAlert,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, colors, fade } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { taskStatus, weekdaysNNo } from '../constants/datatypes';

import { getPopupTitle } from '../constants/menu';
import { useCustomers, useProducts, useServices, useTemplate } from '../hooks';
import PopupCustomer from './PopupCustomer';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import PopupProject from './PopupProject';
import useProjects from '../hooks/useProjects';
import ServiceItemForm from '../Shared/ServiceItemForm';
import ItemsTable from '../Shared/ItemsTable';
import { invoiceClasses } from '../themes';
import RRule from 'rrule';
import { ContractPrint } from '../print';
import { useReactToPrint } from 'react-to-print';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupTaskTime = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  employees,
  resourses,
  departments,
  projects,
  customers,
  theme,
  value = null,
  name = null,
  company,
}: any) => {
  const classes = invoiceClasses();

  const [saving, setSaving] = useState(false);
  const [tasktitle, setTasktitle]: any = useState(null);
  const [start, setStart]: any = useState(null);
  const [end, setEnd]: any = useState(null);

  const [departvalue, setDepartvalue] = useState<any>(
    name === 'departmentId' ? value : null
  );
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [projvalue, setProjvalue] = useState<any>(
    name === 'projectId' ? value : null
  );
  const [projError, setProjError] = useState<any>(false);
  const projRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(
    name === 'employeeId' ? value : null
  );
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();
  const [resovalue, setResovalue] = useState<any>(
    name === 'resourseId' ? value : null
  );
  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = React.useRef();

  const [custvalue, setCustvalue] = useState<any>(
    name === 'customerId' ? value : null
  );
  const [custError, setCustError] = useState<any>(false);
  const custRef: any = React.useRef();

  const [status, setStatus]: any = useState(null);

  const [newtext, setNewtext] = useState('');
  const [total, setTotal] = useState<any>(0);

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openPro, setOpenPro] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const [itemsList, setItemsList] = useState<any>([]);

  const [freq, setFreq] = useState(RRule.DAILY);
  const [count, setCount] = useState(1);
  const [info, setInfo] = useState<any>(null);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const { addCustomer, editCustomer } = useCustomers();
  const { addDepartment, editDepartment } = useDepartmentsUp();
  const { addEmployee, editEmployee } = useEmployeesUp();
  const { addResourse, editResourse } = useResoursesUp();
  const { addProject, editProject } = useProjects();
  const { tempwords, tempoptions, taskExtra } = useTemplate();
  const { products } = useProducts();
  const { services } = useServices();
  const { register, handleSubmit, reset } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const setExtra = ({ item, value }) => {
    const newitem = { ...item, value };
    const newinfo = info?.map((initem: any) => {
      if (initem.id === item.id) {
        return newitem;
      } else {
        return initem;
      }
    });
    setInfo(newinfo);
  };

  const onChangeCount = (e: any) => {
    const value = Number(e.target.value);
    const count = value < 1 ? 1 : value > 1000 ? 1000 : value;
    setCount(count);
  };

  useEffect(() => {
    if (isNew && !info) {
      setInfo(taskExtra);
    }
  }, [taskExtra]);

  const addItemToList = (item: any) => {
    const isInList = itemsList?.filter((li: any) => li._id === item._id)?.[0];
    if (isInList) {
      const newityem = {
        ...isInList,
        itemqty: isInList.itemqty + item.itemqty,
        itemtotal: isInList.itemtotal + item.itemtotal,
        itemtotalcost: isInList.itemtotalcost + item.itemtotalcost,
      };
      const narray = itemsList.map((ilm: any) => {
        if (ilm._id === newityem._id) {
          return newityem;
        } else {
          return ilm;
        }
      });
      setItemsList(narray);
    } else {
      const newArray = [...itemsList, { ...item, userId: user._id }];
      const listwithindex = indexTheList(newArray);
      setItemsList(listwithindex);
    }
  };
  const editItemInList = (item: any) => {
    const newArray = itemsList.map((it: any) => {
      if (it._id === item._id) {
        return item;
      } else {
        return it;
      }
    });
    const listwithindex = indexTheList(newArray);
    setItemsList(listwithindex);
  };

  const removeItemFromList = (index: any) => {
    const newList = [...itemsList];
    newList.splice(index, 1);
    const listwithindex = indexTheList(newList);
    setItemsList(listwithindex);
  };

  useEffect(() => {
    if (itemsList?.length > 0) {
      const totalsin = itemsList.map((litem: any) => litem.itemtotal);
      const sum = totalsin.reduce((psum: any, a: any) => psum + a, 0);
      setTotal(sum);
    } else {
      setTotal(0);
    }
  }, [itemsList]);

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Contract #${row?.docNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    ...row,
    no: row?.docNo,
    start,
    end,
    resovalue,
    custvalue,
    info,
    isRTL: isRTL,
  };
  const openDepartment = () => {
    setOpenDep(true);
  };
  const onCloseDepartment = () => {
    setOpenDep(false);
    setNewtext('');
  };
  const openProject = () => {
    setOpenPro(true);
  };
  const onCloseProject = () => {
    setOpenPro(false);
    setNewtext('');
  };
  const openEmployee = () => {
    setOpenEmp(true);
  };
  const onCloseEmploee = () => {
    setOpenEmp(false);
    setNewtext('');
  };
  const openResourse = () => {
    setOpenRes(true);
  };
  const onCloseResourse = () => {
    setOpenRes(false);
    setNewtext('');
  };
  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext('');
  };

  const onNewCustChange = (nextValue: any) => {
    setCustvalue(nextValue);
  };
  const onNewDepartChange = (nextValue: any) => {
    setDepartvalue(nextValue);
  };
  const onNewProjChange = (nextValue: any) => {
    setProjvalue(nextValue);
  };
  const onNewEmplChange = (nextValue: any) => {
    setEmplvalue(nextValue);
  };
  const onNewResoChange = (nextValue: any) => {
    setResovalue(nextValue);
  };

  const isemployee = user?.isEmployee && user?.employeeId;

  useEffect(() => {
    if (isNew) {
      if (emplvalue && name !== 'departmentId') {
        if (emplvalue?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === emplvalue?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
      }
    }
  }, [emplvalue]);

  useEffect(() => {
    if (isNew) {
      const start = new Date();
      start.setHours(8, 0, 0);
      setStart(start);
      setStatus(taskStatus.filter((es: any) => es.id === 1)?.[0]);
      if (name === 'employeeId') {
        if (value?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === value?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
      }
    }
  }, [open]);

  useEffect(() => {
    if (row && row._id) {
      const depId = row.departmentId;
      const empId = row.employeeId;
      const custId = row.customerId;
      const proId = row.projectId;
      const resId = row.resourseId;
      if (row?.freq) {
        setFreq(row?.freq);
      }

      if (row?.info) {
        setInfo(JSON.parse(row?.info));
      } else {
        setInfo(taskExtra);
      }

      setStart(row?.start);
      setEnd(row?.end);
      setTasktitle(row?.title);
      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (empId) {
        const empl = employees.filter((emp: any) => emp._id === empId)[0];
        setEmplvalue(empl);
      }
      if (proId) {
        const empl = projects.filter((emp: any) => emp._id === proId)[0];
        setProjvalue(empl);
      }
      if (resId) {
        const empl = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(empl);
      }
      if (custId) {
        const cust = customers.filter((cu: any) => cu._id === custId)[0];
        setCustvalue(cust);
      }
    }
  }, [row]);

  const customer = custvalue
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
      };

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
  const employee = emplvalue
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
        employeePhone: undefined,
      };
  const resourse = resovalue
    ? {
        resourseId: resovalue._id,
        resourseName: resovalue.name,
        resourseNameAr: resovalue.nameAr,
        resourseColor: resovalue.color,
      }
    : {
        resourseId: undefined,
        resourseName: undefined,
        resourseNameAr: undefined,
        resourseColor: undefined,
      };

  const project = projvalue
    ? {
        projectId: projvalue._id,
        projectName: projvalue.name,
        projectNameAr: projvalue.nameAr,
        projectColor: projvalue.color,
      }
    : {
        projectId: undefined,
        projectName: undefined,
        projectNameAr: undefined,
        projectColor: undefined,
      };

  const resetAllForms = () => {
    setStart(null);
    setEnd(null);
    setCustvalue(null);
    setDepartvalue(null);
    setProjvalue(null);
    setEmplvalue(null);
    setResovalue(null);
    setStatus(null);
    setTasktitle(null);
    setSaving(false);
    setItemsList([]);
    setCount(1);
    setFreq(RRule.DAILY);
    setTotal(0);
    setInfo(null);
  };

  const onSubmit = async () => {
    if (start > end) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }

    if (!tasktitle) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يرجى اضافة اسم للعقد' : 'Please add Contract title'
      );
      return;
    }

    if (!custvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يرجى اضافة عميل' : 'Please add Customer'
      );
      return;
    }
    if (!resovalue) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `يرجى اضافة ${tempwords?.resourse}`
          : `Please add ${tempwords?.resourse}`
      );
      return;
    }
    if (isNew && (!itemsList || itemsList.length === 0)) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `يجب اضافة عنصر واحد على الأقل`
          : `You should add min one service`
      );
      return;
    }

    setSaving(true);
    const variables: any = {
      id: row && row.id ? row.id : undefined, // is it new or edit
      title: tasktitle ? tasktitle : custvalue?.name,
      start,
      end,
      amount: total,
      status: isNew ? status?.id : 1,
      tasktype: 3, // 1: single event, 2: multi events, 3: no events - only items and time
      customer,
      department,
      employee,
      resourse,
      project,
      info: JSON.stringify(info),
      freq,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };
  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      await successAlert(setAlrt, isRTL);
      setSaving(false);
      onCloseForm();
    } catch (error) {
      onError(error);
      console.log(error);
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
    resetAllForms();
    onClose();
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const date = row?.start ? new Date(row?.start) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = getPopupTitle('task', isNew);

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      print={
        !isNew && [4, 5, 7, 8].includes(company?.tempId)
          ? handleReactPrint
          : undefined
      }
      maxWidth={isNew ? 'lg' : 'xl'}
      fullWidth
      preventclose
      saving={saving}
      canceltitle={isRTL ? 'اغلاق' : 'close'}
      mb={10}
    >
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <CalenderLocal
                  label={words.start}
                  value={start}
                  onChange={(d: any) => setStart(d)}
                  format="dd/MM/yyyy - hh:mm"
                  time
                  disabled={!isNew}
                  mb={0}
                  width={150}
                ></CalenderLocal>
              </Grid>
              <Grid item xs={2} style={{ marginTop: 10 }}>
                {isNew && (
                  <TextFieldLocal
                    required
                    name="count"
                    label={words.qty}
                    value={count}
                    onChange={onChangeCount}
                    type="number"
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={3}>
                <CalenderLocal
                  isRTL={isRTL}
                  label={words.end}
                  value={end}
                  disabled
                  onChange={(d: any) => setEnd(d)}
                  format="dd/MM/yyyy - hh:mm"
                  time
                  mb={0}
                  width={150}
                ></CalenderLocal>
              </Grid>
              <Grid item xs={9}>
                <TextFieldLocal
                  required
                  autoFocus={true}
                  name="tasktitle"
                  label={words.title}
                  value={tasktitle}
                  onChange={(e: any) => setTasktitle(e.target.value)}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
              <Grid item xs={6}>
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
                  showphone
                  openAdd={openCustomer}
                  disabled={name === 'customerId'}
                ></AutoFieldLocal>
              </Grid>
              {!tempoptions?.noRes && (
                <Grid item xs={6}>
                  <AutoFieldLocal
                    name="resourse"
                    title={tempwords?.resourse}
                    words={words}
                    options={resourses}
                    disabled={name === 'resourseId'}
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
              {!tempoptions?.noPro && (
                <Grid item xs={6}>
                  <AutoFieldLocal
                    name="project"
                    title={tempwords?.project}
                    words={words}
                    options={projects}
                    value={projvalue}
                    setSelectValue={setProjvalue}
                    setSelectError={setProjError}
                    selectError={projError}
                    refernce={projRef}
                    register={register}
                    isRTL={isRTL}
                    fullWidth
                    openAdd={openProject}
                    showphone
                    disabled={name === 'projectId'}
                  ></AutoFieldLocal>
                </Grid>
              )}

              <Grid item xs={6}>
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
                  disabled={name === 'departmentId'}
                ></AutoFieldLocal>
              </Grid>
              {!tempoptions?.noEmp && (
                <Grid item xs={6}>
                  <AutoFieldLocal
                    name="employee"
                    title={tempwords?.employee}
                    words={words}
                    options={employees}
                    disabled={isemployee || name === 'employeeId'}
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
            </Grid>
          </Grid>
        </Grid>
        {isNew && (
          <Grid xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Box
                  style={{
                    backgroundColor: fade(colors.grey[400], 0.2),
                    marginTop: 10,
                    borderRadius: 10,
                    height: 268,
                  }}
                >
                  <Box display="flex">
                    <ServiceItemForm
                      services={services}
                      products={products}
                      addItem={addItemToList}
                      words={words}
                      classes={classes}
                      user={user}
                      isRTL={isRTL}
                      setAlrt={setAlrt}
                    ></ServiceItemForm>
                  </Box>
                  <Box style={{ marginBottom: 20 }}>
                    <ItemsTable
                      products={[...services, ...products]}
                      height={190}
                      rows={itemsList}
                      editItem={editItemInList}
                      removeItem={removeItemFromList}
                      isRTL={isRTL}
                      words={words}
                      user={user}
                    ></ItemsTable>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {info?.map((extra: any) => (
              <Grid item xs={extra.multiline ? 8 : 4}>
                <TextFieldLocal
                  name={extra.name}
                  label={isRTL ? extra.nameAr : extra.name}
                  value={extra.value}
                  type={extra.type}
                  multiline={extra.multiline}
                  rows={extra.multiline ? 4 : 1}
                  onChange={(e: any) =>
                    setExtra({ item: extra, value: e.target.value })
                  }
                  fullWidth
                  mb={0}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <PopupCustomer
          newtext={newtext}
          open={openCust}
          onClose={onCloseCustomer}
          isNew={true}
          setNewValue={onNewCustChange}
          row={null}
          addAction={addCustomer}
          editAction={editCustomer}
        ></PopupCustomer>
        <PopupDeprtment
          newtext={newtext}
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
          newtext={newtext}
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
          newtext={newtext}
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
        <PopupProject
          newtext={newtext}
          employees={employees}
          departments={departments}
          resourses={resourses}
          customers={customers}
          open={openPro}
          onClose={onCloseProject}
          isNew={true}
          setNewValue={onNewProjChange}
          row={null}
          addAction={addProject}
          editAction={editProject}
        ></PopupProject>
        <Box>
          <div style={{ display: 'none' }}>
            <ContractPrint
              company={company}
              user={user}
              printData={printData}
              ref={componentRef}
            />
          </div>
        </Box>
      </Box>
    </PopupLayout>
  );
};

export default PopupTaskTime;
