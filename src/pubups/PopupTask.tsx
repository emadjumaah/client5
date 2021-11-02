/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  dublicateAlert,
  errorAlert,
  getReturnItem,
  messageAlert,
  successAlert,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Button, Typography } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { eventStatus, weekdaysNNo } from '../constants/datatypes';
import { compressEvents } from '../common/time';
import { moneyFormat } from '../Shared/colorFormat';
import PopupTaskAppointment from './PopupTaskAppointment';
import EventsTable from '../Shared/EventsTable';
import _ from 'lodash';
import { getPopupTitle } from '../constants/menu';
import { useCustomers, useTemplate } from '../hooks';
import PopupCustomer from './PopupCustomer';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import PopupProject from './PopupProject';
import useProjects from '../hooks/useProjects';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupTask = ({
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
  servicesproducts,
  theme,
  refresh,
  value = null,
  name = null,
  setNewValue,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [showtable, setShowTable] = useState(isNew);

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

  const [openEvent, setOpenEvent] = useState<any>(false);
  const [evList, setEvList] = useState<any>([]);
  const [total, setTotal] = useState<any>(null);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openPro, setOpenPro] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { addCustomer, editCustomer } = useCustomers();
  const { addDepartment, editDepartment } = useDepartmentsUp();
  const { addEmployee, editEmployee } = useEmployeesUp();
  const { addResourse, editResourse } = useResoursesUp();
  const { addProject, editProject } = useProjects();
  const { tempwords, tempoptions } = useTemplate();

  const { register, handleSubmit, reset } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

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

  const addEventsToList = (events: any) => {
    const newArray = [...evList, ...events];
    const sorted = _.sortBy(newArray, 'startDate');
    const listwithindex = indexTheList(sorted);
    setEvList(listwithindex);
  };

  const removeEventFromList = (index: any) => {
    const newList = [...evList];
    newList.splice(index, 1);
    const listwithindex = indexTheList(newList);
    setEvList(listwithindex);
  };

  const isemployee = user?.isEmployee && user?.employeeId;

  useEffect(() => {
    if (isemployee) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user, employees]);

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
      const end = new Date();
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + 7);
      end.setHours(23, 59, 59, 999);
      setStart(start);
      setEnd(end);
      setStatus(eventStatus.filter((es: any) => es.id === 1)?.[0]);
      setEvList([]);
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
  const getOverallTotal = () => {
    const evssum = _.sumBy(evList, 'amount');
    setTotal(evssum);
  };
  useEffect(() => {
    getOverallTotal();
  }, [evList]);

  useEffect(() => {
    if (row && row._id) {
      const depId = row.departmentId;
      const empId = row.employeeId;
      const custId = row.customerId;
      const proId = row.projectId;
      const resId = row.resourseId;

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
    setShowTable(false);
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
        isRTL ? 'يرجى اضافة اسم للمهمة' : 'Please add Task title'
      );
      return;
    }

    // if (!custvalue) {
    //   await messageAlert(
    //     setAlrt,
    //     isRTL ? 'يرجى اضافة عميل للفاتورة' : 'Please add Customer'
    //   );
    //   return;
    // }
    // if (isNew && (!evList || evList.length === 0)) {
    //   await messageAlert(
    //     setAlrt,
    //     isRTL ? 'يرجى اضافة موعد' : 'Please add Appointment'
    //   );
    //   return;
    // }
    setSaving(true);
    const events =
      evList && evList.length > 0 ? compressEvents(evList) : undefined;

    const variables: any = {
      id: row && row.id ? row.id : undefined, // is it new or edit
      title: tasktitle ? tasktitle : custvalue?.name,
      start,
      end,
      amount: total,
      status: status ? status.id : 1,
      tasktype: 2, // 1: single event, 2: multi events, 3: no events - only items and time
      events,
      evQty: evList ? evList.length : undefined,
      evDone: isNew ? 0 : undefined,
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
      project: projvalue
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
    };
    const mutate = isNew ? addAction : editAction;

    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      if (evList?.length === 0) {
        const res = await mutate({ variables });
        const nitem = getReturnItem(res, 'createTask');
        if (setNewValue && nitem) setNewValue(nitem, 'task');
        setSaving(false);
        await successAlert(setAlrt, isRTL);
        onCloseForm();
      } else {
        mutate({ variables });
        setTimeout(() => {
          refresh();
          onCloseForm();
        }, 1000);
      }
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
      mt={10}
      maxWidth={isNew ? 'lg' : 'xl'}
      fullWidth
      preventclose
      saving={saving}
      // bgcolor={colors.deepPurple[500]}
      mb={10}
    >
      <>
        <Box display="flex">
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
            {row?.docNo}
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={3}>
            <CalenderLocal
              isRTL={isRTL}
              label={words.start}
              value={start}
              onChange={(d: any) => setStart(d)}
              format="dd/MM/yyyy - hh:mm"
              time
              mb={0}
            ></CalenderLocal>
          </Grid>
          <Grid item xs={3}>
            <CalenderLocal
              isRTL={isRTL}
              label={words.end}
              value={end}
              onChange={(d: any) => setEnd(d)}
              format="dd/MM/yyyy - hh:mm"
              time
              mb={0}
            ></CalenderLocal>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
            {!tempoptions.noPro && (
              <AutoFieldLocal
                name="project"
                title={tempwords.project}
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
            )}
          </Grid>
          <Grid item xs={3}>
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
              openAdd={openCustomer}
              disabled={name === 'customerId'}
            ></AutoFieldLocal>
          </Grid>
          <Grid item xs={3}></Grid>
          {!tempoptions?.noEmp && (
            <Grid item xs={3}>
              <AutoFieldLocal
                name="employee"
                title={tempwords.employee}
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
          {!tempoptions?.noRes && (
            <Grid item xs={3}>
              <AutoFieldLocal
                name="resourse"
                title={tempwords.resourse}
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
          <Grid item xs={3}>
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
              openAdd={openDepartment}
              isRTL={isRTL}
              fullWidth
              disabled={name === 'departmentId'}
            ></AutoFieldLocal>
          </Grid>
        </Grid>
        {!setNewValue && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {!showtable && isNew && (
                <Box
                  display="flex"
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginInlineStart: 10,
                  }}
                >
                  <Button
                    color="primary"
                    onClick={() => {
                      setShowTable(true);
                      setOpenEvent(true);
                    }}
                    variant="contained"
                  >
                    {isRTL ? 'اضافة مواعيد' : 'Add Appointments'}
                  </Button>
                </Box>
              )}
              {showtable && (
                <Box
                  style={{
                    backgroundColor: '#F3F3F3',
                    marginTop: 15,
                    borderRadius: 10,
                  }}
                >
                  <Box
                    display="flex"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      marginInlineStart: 10,
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={() => setOpenEvent(true)}
                      variant="contained"
                    >
                      {isRTL ? 'اضافة' : 'Add'}
                    </Button>
                  </Box>
                  <Box style={{ marginBottom: 20 }}>
                    <EventsTable
                      rows={evList}
                      removeEventFromList={removeEventFromList}
                      isRTL={isRTL}
                      words={words}
                    ></EventsTable>
                    <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {words.total} : {moneyFormat(total)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
        <PopupTaskAppointment
          open={openEvent}
          onClose={() => setOpenEvent(false)}
          row={null}
          isNew={true}
          employees={employees}
          departments={departments}
          customers={customers}
          resourses={resourses}
          employee={emplvalue}
          department={departvalue}
          customer={custvalue}
          resourse={resovalue}
          servicesproducts={servicesproducts}
          theme={theme}
          setEnd={setEnd}
          addEventsToList={addEventsToList}
        ></PopupTaskAppointment>
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
      </>
    </PopupLayout>
  );
};

export default PopupTask;
