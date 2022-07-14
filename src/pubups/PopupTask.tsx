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
import {
  Box,
  Button,
  colors,
  fade,
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
import { taskStatus, weekdaysNNo } from '../constants/datatypes';
import { compressEvents } from '../common/time';
import {
  actionTypeFormatter,
  getDateDayTimeFormat,
  getDateDayWeek,
} from '../Shared/colorFormat';
import _ from 'lodash';
import { getPopupTitle } from '../constants/menu';
import { useCustomers, useProducts, useServices, useTemplate } from '../hooks';
import PopupCustomer from './PopupCustomer';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartments from '../hooks/useDepartments';
import useEmployees from '../hooks/useEmployees';
import useResourses from '../hooks/useResourses';
import PopupProject from './PopupProject';
import useProjects from '../hooks/useProjects';
import ServiceItemForm from '../Shared/ServiceItemForm';
import ItemsTable from '../Shared/ItemsTable';
import { invoiceClasses } from '../themes';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import { byweekdayOptions, intervalOptions } from '../constants/rrule';
import RRule from 'rrule';
import getRruleData from '../common/getRruleData';
import { getEventsList } from '../common/helpers';
import { ContractPrint } from '../print';
import { useReactToPrint } from 'react-to-print';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import PopupAction from './PopupAction';
import SelectMulti from '../Shared/SelectMulti';
import { sleep } from '../Shared/helpers';

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
  theme,
  refresh,
  value = null,
  name = null,
  setNewValue,
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

  const [evList, setEvList] = useState<any>([]);
  const [total, setTotal] = useState<any>(null);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openPro, setOpenPro] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const [itemsList, setItemsList] = useState<any>([]);
  const [rrule, setRrule] = useState<any>(null);
  const [weekdays, setWeekdays] = useState([]);
  const [byweekday, setByweekday] = useState([]);

  const [freq, setFreq] = useState(RRule.DAILY);
  const [count, setCount] = useState(1);
  const [interval, setInterval] = useState(1);
  const [rruletype, setRruletype] = useState(1);
  const [totals, setTotals] = useState<any>({});
  const [info, setInfo] = useState<any>(null);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [openAction, setOpenAction] = useState(false);
  const [type, setType] = useState(null);
  const [actionslist, setActionslist] = useState([]);
  const [selected, setSelected] = useState(null);

  const { addCustomer, editCustomer } = useCustomers();
  const { addDepartment, editDepartment } = useDepartments();
  const { addEmployee, editEmployee } = useEmployees();
  const { addResourse, editResourse } = useResourses();
  const { addProject, editProject } = useProjects();
  const { tempwords, tempoptions, taskExtra } = useTemplate();
  const { products } = useProducts();
  const { services } = useServices();
  const { register, handleSubmit, reset } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

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
    const count = value < 1 ? 1 : value > 365 ? 365 : value;
    setCount(count);
  };

  const onChangeRruletype = (e: any) => {
    const value = e.target.value;
    setRruletype(value);
    if (value === 1) {
      setFreq(RRule.DAILY);
      setInterval(value);
    } else if (value > 5 && value < 9) {
      setFreq(RRule.WEEKLY);
      setInterval(1);
    } else if (value === 30) {
      setFreq(RRule.DAILY);
      setInterval(value);
    } else if (value === 31) {
      setFreq(RRule.MONTHLY);
      setInterval(1);
    }
  };

  const onChangeInterval = (e: any) => {
    const value = Number(e.target.value);
    setInterval(value > 1 ? value : 1);
  };

  const getEventOverallTotal = () => {
    const totalsin = itemsList.map((litem: any) => litem.itemtotal);
    const sum = totalsin.reduce((psum: any, a: any) => psum + a, 0);
    const costtotals = itemsList.map((litem: any) => litem.itemtotalcost);
    const costsum = costtotals.reduce((psum: any, a: any) => psum + a, 0);
    const amount = sum;
    const profit = sum - costsum;
    const tots = {
      itemsSum: amount,
      itemsCostSum: costsum,
      costAmount: costsum,
      total: sum,
      amount,
      profit,
    };
    setTotals(tots);
  };
  useEffect(() => {
    getEventOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (isNew && !info) {
      setInfo(taskExtra);
    }
  }, [taskExtra]);

  useEffect(() => {
    if (weekdays && weekdays.length > 0) {
      const bwd = weekdays.map((wd: any) => wd.value);
      setByweekday(bwd);
    }
  }, [weekdays]);
  useEffect(() => {
    if (freq !== RRule.WEEKLY) {
      setWeekdays([]);
      setByweekday([]);
    }
  }, [freq]);

  useEffect(() => {
    if (isNew) {
      const rdata = getRruleData({
        freq,
        byweekday: weekdays?.length > 0 ? byweekday : undefined,
        dtstart: start,
        until: null,
        interval,
        count,
      });
      setRrule(rdata);
    }
  }, [start, freq, count, interval, byweekday, weekdays]);
  useEffect(() => {
    if (isNew && rrule?.all && rrule?.all?.length > 0) {
      setEnd(rrule.all[rrule.all.length - 1]);
    }
  }, [rrule]);

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
      start.setHours(8, 0, 0);
      setStart(start);
      setStatus(taskStatus.filter((es: any) => es.id === 1)?.[0]);
      setEvList([]);
    }
  }, [open]);
  const getOverallTotal = () => {
    const evssum = _.sumBy(evList, 'amount');
    if (freq !== RRule.DAILY || interval !== 1) {
      const namount = evssum - totals.amount;
      setTotal(namount);
    } else {
      setTotal(evssum);
    }
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

  useEffect(() => {
    if (isNew && start && end) {
      const event = {
        title: tasktitle,
        startDate: start,
        endDate: end,
        amount: totals.amount,
        customer,
        department,
        employee,
        resourse,
        project,
        status: 2,
        items: JSON.stringify(itemsList),
        user: user._id,
      };
      const eventlist = getEventsList({
        start,
        event,
        rrule,
        actionslist,
        isRTL,
        weekdays,
      });
      const sorted = _.sortBy(eventlist, 'startDate');
      const listwithindex = indexTheList(sorted);
      setEvList(listwithindex);
    }
  }, [
    itemsList,
    rrule,
    projvalue,
    departvalue,
    custvalue,
    emplvalue,
    start,
    totals,
  ]);

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
    setRrule(null);
    setItemsList([]);
    setCount(1);
    setInterval(1);
    setRruletype(1);
    setFreq(RRule.DAILY);
    setTotals({});
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
    const events =
      evList && evList.length > 0 ? compressEvents(evList) : undefined;
    const variables: any = {
      id: row && row.id ? row.id : undefined, // is it new or edit
      title: tasktitle ? tasktitle : custvalue?.name,
      start,
      end,
      amount: isNew ? total : undefined,
      status: isNew ? status?.id : 1,
      tasktype: 2, // 1: single event, 2: multi events, 3: no events - only items and time
      events,
      evQty: isNew ? evList?.length : undefined,
      evDone: isNew ? 0 : undefined,
      customer,
      department,
      employee,
      resourse,
      project,
      info: JSON.stringify(info),
      freq,
      interval,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };
  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      await sleep(3);
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
                  <SelectLocal
                    options={intervalOptions}
                    value={rruletype}
                    onChange={onChangeRruletype}
                    isRTL={isRTL}
                    width={128}
                  ></SelectLocal>
                )}
              </Grid>
              {freq === RRule.WEEKLY && (
                <Grid item xs={3} style={{ marginTop: 18 }}>
                  <SelectMulti
                    options={byweekdayOptions}
                    value={weekdays}
                    setValue={setWeekdays}
                    words={words}
                    isRTL={isRTL}
                    name="weekdays"
                    width={180}
                  ></SelectMulti>
                </Grid>
              )}
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
              <Grid item xs={2} style={{ marginTop: 10 }}>
                {isNew && (
                  <TextFieldLocal
                    required
                    name="interval"
                    label={words.interval}
                    value={interval}
                    onChange={onChangeInterval}
                    type="number"
                    mb={0}
                    fullWidth
                  />
                )}
              </Grid>
              {freq !== RRule.WEEKLY && <Grid item xs={3}></Grid>}
              <Grid item xs={3}>
                {rrule?.all && (
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
                )}
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
                  options={departments.filter((d: any) => d.depType === 1)}
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
          {isNew && (
            <Grid item xs={4}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  {rrule?.all && (
                    <Paper
                      style={{
                        maxHeight: 240,
                        overflow: 'auto',
                        minHeight: 240,
                      }}
                      elevation={3}
                    >
                      <Box style={{ flexDirection: 'row' }}>
                        {rrule?.all?.map((al: any, index: any) => {
                          if (index === 0) {
                            return null;
                          }
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
                              <Typography>
                                {getDateDayWeek(al, isRTL)}
                              </Typography>
                              <Typography variant="caption">{index}</Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
          {isNew && <Grid item xs={6}></Grid>}
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
              <Grid
                item
                xs={4}
                style={{
                  marginTop: 20,
                  backgroundColor: fade(colors.grey[400], 0.2),
                  borderRadius: 10,
                  height: 268,
                }}
              >
                <Button
                  variant="outlined"
                  style={{
                    margin: 10,
                    fontSize: 14,
                    minWidth: 80,
                  }}
                  onClick={() => {
                    setSelected(null);
                    setType(3);
                    setOpenAction(true);
                  }}
                >
                  <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {isRTL ? 'اضافة تنبيه' : 'Add Reminder'}
                  </Typography>
                </Button>
                <Paper style={{ height: 195, overflow: 'auto' }}>
                  {actionslist.map((act: any) => {
                    return (
                      <ListItem>
                        <ListItemText
                          primary={actionTypeFormatter({ row: act })}
                          secondary={getDateDayTimeFormat(act.sendtime, isRTL)}
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
        ></PopupDeprtment>
        <PopupEmployee
          newtext={newtext}
          open={openEmp}
          onClose={onCloseEmploee}
          isNew={true}
          setNewValue={onNewEmplChange}
          row={null}
          addAction={addEmployee}
          editAction={editEmployee}
        ></PopupEmployee>
        <PopupResourses
          newtext={newtext}
          open={openRes}
          onClose={onCloseResourse}
          isNew={true}
          setNewValue={onNewResoChange}
          row={null}
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
        <PopupAction
          open={openAction}
          onClose={() => {
            setOpenAction(false);
            setSelected(null);
          }}
          row={selected}
          type={type}
          isNew={selected ? false : true}
          customer={custvalue}
          addAction={addActionToList}
          editAction={editActionInList}
          theme={theme}
          event={{ ...evList?.[0], startDate: start, endDate: end }}
        ></PopupAction>
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

export default PopupTask;
