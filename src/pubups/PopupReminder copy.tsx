/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { weekdaysNNo } from '../constants/datatypes';

import { getDateDayWeek } from '../Shared/colorFormat';
import { useCustomers, useTemplate } from '../hooks';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PopupCustomer from './PopupCustomer';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import PopupAddrRule from './PopupAddrRule';
import PopupAction from './PopupAction';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import { freqOptions } from '../constants/rrule';
import RRule from 'rrule';
import { getReminderRruleData } from '../common/getRruleData';
import useTasks from '../hooks/useTasks';
import PopupTask from './PopupTask';
import useProjects from '../hooks/useProjects';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupReminder = ({
  open,
  onClose,
  row,
  isNew,
  theme,
  addAction,
  editAction,
}: any) => {
  const [saving, setSaving] = useState(false);

  const [runtime, setRuntime]: any = useState(null);
  const [startDate, setStartDate]: any = useState(null);
  const [endDate, setEndDate]: any = useState(null);

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [resovalue, setResovalue] = useState<any>(null);
  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = React.useRef();

  const [taskvalue, setTaskvalue] = useState<any>(null);

  const [custvalue, setCustvalue] = useState<any>(null);

  const [rrule, setRrule] = useState<any>(null);
  const [openMulti, setOpenMulti] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [type, setType] = useState(null);
  const [openAction, setOpenAction] = useState(false);
  const [actionslist, setActionslist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rtitle, setRtitle]: any = useState(null);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);
  const [openTsk, setOpenTsk] = useState(false);

  const [freq, setFreq] = useState(RRule.DAILY);
  const [count, setCount] = useState(1);
  // const [interval, setInterval] = useState(1);

  const { customers, addCustomer, editCustomer } = useCustomers();

  const { departments, addDepartment, editDepartment } = useDepartmentsUp();
  const { employees, addEmployee, editEmployee } = useEmployeesUp();
  const { resourses, addResourse, editResourse } = useResoursesUp();
  const { tempwords, tempoptions } = useTemplate();
  const { tasks, addTask, editTask } = useTasks();
  const { projects } = useProjects();

  const { register, handleSubmit } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const isemployee = user?.isEmployee && user?.employeeId;

  const openDepartment = () => {
    setOpenDep(true);
  };
  const onCloseDepartment = () => {
    setOpenDep(false);
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
  // const openCustomer = () => {
  //   setOpenCust(true);
  // };
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
  const onNewEmplChange = (nextValue: any) => {
    setEmplvalue(nextValue);
  };
  const onNewResoChange = (nextValue: any) => {
    setResovalue(nextValue);
  };

  const onChangeFreq = (e: any) => {
    const value = e.target.value;
    setFreq(value);
  };

  const onChangeCount = (e: any) => {
    const value = Number(e.target.value);
    const count = value < 1 ? 1 : value > 365 ? 365 : value;
    setCount(count);
  };
  // const onChangeInterval = (e: any) => {
  //   const value = Number(e.target.value);
  //   const count = value < 1 ? 1 : value > 365 ? 365 : value;
  //   setInterval(count);
  // };

  const openTask = () => {
    setOpenTsk(true);
  };

  const onNewTaskChange = (nextValue: any) => {
    setTaskvalue(nextValue);
  };

  const onCloseTask = () => {
    setOpenTsk(false);
    setNewtext('');
  };

  useEffect(() => {
    if (isNew) {
      const start = new Date();
      const end = new Date();
      start.setMinutes(0);
      end.setHours(end.getHours() + 1);
      end.setMinutes(0);
      setStartDate(start);
      setEndDate(end);
    }
  }, [open]);

  useEffect(() => {
    if (row && row._id) {
      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;
      const custId = row.customerId;
      const taskId = row.taskId;
      setRtitle(row?.title);
      setRuntime(new Date(row?.runtime));
      setStartDate(new Date(row?.startDate));
      setEndDate(new Date(row?.endDate));
      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (empId) {
        const empl = employees.filter((emp: any) => emp._id === empId)[0];
        setEmplvalue(empl);
      }
      if (resId) {
        const res = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(res);
      }
      if (taskId) {
        const tsk = tasks.filter((ts: any) => ts.id === taskId)[0];
        setTaskvalue(tsk);
      }
      if (custId) {
        const cust = customers.filter((cu: any) => cu._id === custId)[0];
        setCustvalue(cust);
      }
      if (row?.actions) {
        setActionslist(JSON.parse(row?.actions));
      }
      if (row?.rruledata) {
        setRrule(JSON.parse(row?.rruledata));
      }
    }
  }, [row]);

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
      const start = new Date();
      start.setMinutes(0);
      start.setHours(start.getHours() + 1);
      setRuntime(start);
    }
  }, [open]);

  // useEffect(() => {
  //   if (isNew) {
  //     if (emplvalue) {
  //       if (emplvalue?.departmentId) {
  //         const dept = departments.filter(
  //           (dep: any) => dep._id === emplvalue?.departmentId
  //         )?.[0];
  //         setDepartvalue(dept);
  //       }
  //     }
  //   }
  // }, [emplvalue]);

  // useEffect(() => {
  //   if (isNew) {
  //     if (resovalue) {
  //       if (resovalue?.departmentId) {
  //         const dept = departments.filter(
  //           (dep: any) => dep._id === resovalue?.departmentId
  //         )?.[0];
  //         setDepartvalue(dept);
  //       }
  //     }
  //   }
  // }, [resovalue]);

  useEffect(() => {
    if (isNew) {
      const rdata = getReminderRruleData({
        freq,
        byweekday: undefined,
        dtstart: startDate,
        until: null,
        interval: 1,
        count,
      });
      setRrule(rdata);
    }
  }, [startDate, freq, count]);

  const addActionToList = (item: any) => {
    const newArray = [...actionslist, item];
    const listwithindex = indexTheList(newArray);
    setActionslist(listwithindex);
  };
  const editActionInList = (item: any) => {
    const newArray = actionslist.map((it: any) => {
      if (item._id) {
        if (it._id === item._id) {
          return item;
        } else {
          return it;
        }
      } else {
        if (it.index === item.index) {
          return item;
        } else {
          return it;
        }
      }
    });
    const listwithindex = indexTheList(newArray);
    setActionslist(listwithindex);
  };

  const removeActionFromList = (item: any) => {
    const newlist = actionslist.filter((il: any) => il.index !== item.index);
    const listwithindex = indexTheList(newlist);
    setActionslist(listwithindex);
  };

  const resetAllForms = () => {
    setRuntime(null);
    setCustvalue(null);
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
    setRrule(null);
    setActionslist([]);
    setTaskvalue(null);
    setSelected(null);
    setSaving(false);
    setRtitle(null);
    setFreq(RRule.DAILY);
    setCount(1);
  };
  const onSubmit = async () => {
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      title: rtitle,
      startDate,
      endDate,
      runtime,
      rRule: rrule?.str,
      rruledata: rrule ? JSON.stringify(rrule) : undefined,
      actions: JSON.stringify(actionslist),
      customerId: custvalue ? custvalue._id : undefined,
      departmentId: departvalue ? departvalue._id : undefined,
      employeeId: emplvalue ? emplvalue._id : undefined,
      resourseId: resovalue ? resovalue._id : undefined,
      taskId: taskvalue ? taskvalue.id : undefined,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      onCloseForm();
    } catch (error) {
      onError(error);
      console.log('error popup', error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
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

  const date = row?.runtime ? new Date(row?.runtime) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = isRTL
    ? isNew
      ? 'اضافة تذكير'
      : 'تعديل تذكير'
    : isNew
    ? 'New Reminder'
    : 'Edit Reminder';

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
      maxWidth="md"
      saving={saving}
    >
      <>
        <Box display="flex">
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
            {row?.docNo}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <CalenderLocal
                      isRTL={isRTL}
                      label={words.start}
                      value={startDate}
                      onChange={(d: any) => {
                        setStartDate(d);
                        setRuntime(d);
                        const end = new Date(d).getTime() + 60 * 60 * 1000;
                        setEndDate(new Date(end));
                      }}
                      format="dd/MM/yyyy - hh:mm"
                      time
                    ></CalenderLocal>
                  </Grid>

                  <Grid item xs={4}>
                    <SelectLocal
                      options={freqOptions}
                      value={freq}
                      onChange={onChangeFreq}
                      isRTL={isRTL}
                      mb={0}
                    ></SelectLocal>
                  </Grid>
                  <Grid item xs={4}>
                    <TextFieldLocal
                      required
                      name="count"
                      label={words.qty}
                      value={count}
                      onChange={onChangeCount}
                      type="number"
                      mb={0}
                    />
                  </Grid>
                  {/* <Grid item xs={4}>
                    <TextFieldLocal
                      required
                      name="interval"
                      label={words.interval}
                      value={interval}
                      onChange={onChangeInterval}
                      type="number"
                    />
                  </Grid> */}
                  <Grid item xs={12}>
                    <TextFieldLocal
                      autoFocus={true}
                      name="rtitle"
                      label={words.description}
                      value={rtitle}
                      onChange={(e: any) => setRtitle(e.target.value)}
                      row={row}
                      fullWidth
                      mb={0}
                    />
                  </Grid>

                  {!tempoptions?.noRes && (
                    <Grid item xs={6}>
                      <AutoFieldLocal
                        name="resourse"
                        title={tempwords.resourse}
                        words={words}
                        options={resourses}
                        disabled={isemployee}
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
                  <Grid item xs={6}>
                    <AutoFieldLocal
                      name="task"
                      title={tempwords.task}
                      words={words}
                      options={tasks}
                      value={taskvalue}
                      setSelectValue={setTaskvalue}
                      isRTL={isRTL}
                      fullWidth
                      openAdd={openTask}
                    ></AutoFieldLocal>
                  </Grid>

                  {!tempoptions?.noEmp && (
                    <Grid item xs={6}>
                      <AutoFieldLocal
                        name="employee"
                        title={tempwords.employee}
                        words={words}
                        options={employees}
                        disabled={isemployee}
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
                  {/* <Grid item xs={4}>
                    <AutoFieldLocal
                      name="customer"
                      title={tempwords.customer}
                      words={words}
                      options={customers}
                      value={custvalue}
                      setSelectValue={setCustvalue}
                      register={register}
                      isRTL={isRTL}
                      openAdd={openCustomer}
                      showphone
                      fullWidth
                    ></AutoFieldLocal>
                  </Grid> */}

                  <Grid item xs={6}>
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
                    ></AutoFieldLocal>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                {rrule?.all && (
                  <Paper
                    style={{
                      height: 210,
                      overflow: 'auto',
                    }}
                  >
                    <Box style={{ flexDirection: 'row' }}>
                      {rrule?.all?.map((al: any, index: any) => {
                        return (
                          <Box
                            display="flex"
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: '#f5f5f5',
                              margin: 4,
                              padding: 4,
                            }}
                          >
                            <Typography>{getDateDayWeek(al, isRTL)}</Typography>
                            <Typography variant="caption">
                              {index + 1}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>
                )}
              </Grid>
              <Grid item xs={8}></Grid>
              <Grid
                item
                xs={4}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 5,
                }}
              >
                <Button
                  variant="outlined"
                  style={{
                    marginBottom: 10,
                    fontSize: 14,
                    minWidth: 80,
                  }}
                  onClick={() => {
                    setSelected(null);
                    setType(3);
                    setOpenAction(true);
                  }}
                >
                  {isRTL ? 'اضافة تنبيه' : 'Add Notification'}
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    marginBottom: 10,
                    fontSize: 14,
                    minWidth: 80,
                    marginRight: 10,
                    marginLeft: 10,
                  }}
                  onClick={() => {
                    setSelected(null);
                    setType(1);
                    setOpenAction(true);
                  }}
                >
                  {isRTL ? 'اضافة رسالة' : 'Add SMS'}
                </Button>
                <Paper style={{ height: 150, overflow: 'auto' }}>
                  {actionslist.map((act: any) => {
                    return (
                      <ListItem>
                        <ListItemText
                          primary={act.phone}
                          secondary={act.body}
                        />
                        <IconButton
                          onClick={() => removeActionFromList(act)}
                          title="Delete row"
                          style={{ padding: 5 }}
                        >
                          <DeleteOutlinedIcon
                            style={{ fontSize: 22, color: '#a76f9a' }}
                          />
                        </IconButton>
                        <IconButton
                          style={{ padding: 5 }}
                          onClick={() => {
                            setSelected(act);
                            setOpenAction(true);
                          }}
                          title="Edit row"
                        >
                          <EditOutlinedIcon
                            style={{ fontSize: 22, color: '#729aaf' }}
                          />
                        </IconButton>
                      </ListItem>
                    );
                  })}
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            <Grid container spacing={2}></Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}></Grid>

              <Grid item xs={4}></Grid>
            </Grid>
            <PopupAddrRule
              start={runtime}
              open={openMulti}
              onClose={() => setOpenMulti(false)}
              onSubmit={setRrule}
              theme={theme}
              isRTL={isRTL}
              words={words}
              noStartView={true}
              noEndView={true}
            ></PopupAddrRule>

            <PopupAction
              open={openAction}
              onClose={() => {
                setOpenAction(false);
                setSelected(null);
              }}
              isReminder
              row={selected}
              type={type}
              isNew={selected ? false : true}
              customer={custvalue}
              addAction={addActionToList}
              editAction={editActionInList}
              theme={theme}
              event={{ ...row, startDate, endDate }}
            ></PopupAction>
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
            <PopupTask
              newtext={newtext}
              open={openTsk}
              onClose={onCloseTask}
              isNew={true}
              setNewValue={onNewTaskChange}
              row={null}
              employees={employees}
              resourses={resourses}
              departments={departments}
              projects={projects}
              customers={customers}
              addAction={addTask}
              editAction={editTask}
            ></PopupTask>
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
          </Grid>
        </Grid>
      </>
    </PopupLayout>
  );
};

export default PopupReminder;
