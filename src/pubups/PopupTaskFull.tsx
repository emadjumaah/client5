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
  Checkbox,
  colors,
  fade,
  FormControlLabel,
  Paper,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { weekdaysNNo } from '../constants/datatypes';
import { compressEvents } from '../common/time';
import { getDateDayWeek } from '../Shared/colorFormat';
import _ from 'lodash';
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
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import {
  byweekdayOptions,
  intervalOptions,
  monthdaysOptions,
} from '../constants/rrule';
import RRule from 'rrule';
import getRruleData from '../common/getRruleData';
import { getEventsList, getInvDays } from '../common/helpers';
import { ContractPrint } from '../print';
import { useReactToPrint } from 'react-to-print';
import SelectMulti from '../Shared/SelectMulti';
import { useLazyQuery } from '@apollo/client';
import { getOperationItems } from '../graphql';
import getTaskDoneEvents from '../graphql/query/getTaskDoneEvents';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupTaskFull = ({
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

  const [isEvents, setIsEvents] = useState(false);
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

  const [evList, setEvList] = useState<any>([]);
  const [doneEvents, setDoneEvents] = useState<any>(null);
  const [newtext, setNewtext] = useState('');
  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openPro, setOpenPro] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const [itemsList, setItemsList] = useState<any>([]);
  const [rrule, setRrule] = useState<any>(null);
  const [weekdays, setWeekdays]: any = useState([]);
  const [byweekday, setByweekday] = useState([]);
  const [monthdays, setMonthdays] = useState([]);
  const [bymonthday, setBymonthday] = useState([]);

  const [invdays, setInvdays] = useState(0);

  const [isCustom, setIsCustom] = useState(false);
  const [isLastday, setIsLastday] = useState(false); // lastday of month
  const [isatStart, setIsatStart] = useState(false);

  const [freq, setFreq] = useState(RRule.DAILY);
  const [count, setCount] = useState(1);
  const [dayCost, setDayCost] = useState(null);
  const [interval, setInterval] = useState(1);
  const [periodType, setPeriodType] = useState(1);

  const [total, setTotal] = useState<any>(0);
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

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems);
  const [getDoneEvents, doneEventsData]: any = useLazyQuery(getTaskDoneEvents);

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
  const onChangeDayCost = (e: any) => {
    const value = Number(e.target.value);
    setDayCost(value);
  };

  const onChangePeriodType = (e: any) => {
    const value = e.target.value;
    setPeriodType(value);
    if (value === 1) {
      setFreq(RRule.DAILY);
      setInterval(value);
      setMonthdays([]);
      setBymonthday([]);
      setIsCustom(false);
    } else if (value === 7) {
      setFreq(RRule.WEEKLY);
      setInterval(1);
      setMonthdays([]);
      setBymonthday([]);
      setIsCustom(false);
    } else if (value === 30) {
      setFreq(RRule.DAILY);
      setInterval(value);
      setMonthdays([]);
      setBymonthday([]);
      setIsCustom(false);
    } else if (value === 31) {
      setFreq(RRule.MONTHLY);
      setInterval(1);
      setMonthdays([]);
      setBymonthday([]);
      setIsCustom(false);
    } else if (value === 11) {
      setFreq(1);
      setInterval(1);
      setMonthdays([{ id: 1, name: '1', nameAr: '1', value: 1 }]);
      setBymonthday([1]);
      setIsCustom(false);
      setIsLastday(false);
    } else if (value === 33) {
      setFreq(1);
      setInterval(1);
      setMonthdays([{ id: 1, name: '1', nameAr: '1', value: 1 }]);
      setBymonthday([1]);
      setIsCustom(false);
      setIsLastday(true);
    } else if (value === 100) {
      setFreq(1);
      setInterval(1);
      setCount(1);
      setMonthdays([]);
      setBymonthday([]);
      setIsCustom(true);
      const rdata = getRruleData({
        freq: 1,
        byweekday: null,
        dtstart: start,
        until: end,
        interval: 1,
        bymonthday: null,
        count: 1,
        isCustom: true,
      });
      setRrule(rdata);
    }
  };

  const onChangeInterval = (e: any) => {
    const value = Number(e.target.value);
    setInterval(value > 1 ? value : 1);
  };

  useEffect(() => {
    const items = itemsData?.data?.['getOperationItems']?.data || [];
    const devents = doneEventsData?.data?.['getTaskDoneEvents']?.data;
    if (devents) {
      setDoneEvents(JSON.parse(devents));
    }
    if (items && items.length > 0) {
      const ids = items.map((it: any) => it.itemId);
      const servlist = [...services, ...products].filter((ser: any) =>
        ids.includes(ser._id)
      );
      const itemsWqtyprice = items.map((item: any, index: any) => {
        const {
          categoryId,
          categoryName,
          categoryNameAr,
          departmentId,
          departmentName,
          departmentNameAr,
          departmentColor,
          employeeId,
          employeeName,
          employeeNameAr,
          employeeColor,
          resourseId,
          resourseName,
          resourseNameAr,
          resourseColor,
          note,
        } = item;
        const serv = servlist.filter((se: any) => se._id === item.itemId)[0];
        return {
          ...serv,
          categoryId,
          categoryName,
          categoryNameAr,
          departmentId,
          departmentName,
          departmentNameAr,
          departmentColor,
          employeeId,
          employeeName,
          employeeNameAr,
          employeeColor,
          resourseId,
          resourseName,
          resourseNameAr,
          resourseColor,
          index,
          itemprice: item.itemPrice,
          itemqty: item.qty,
          itemtotal: item.total,
          note,
        };
      });
      itemsWqtyprice.sort((a: any, b: any) =>
        a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
      );
      setItemsList(itemsWqtyprice);
    }
  }, [itemsData, doneEventsData]);
  useEffect(() => {
    const itemsTotal = _.sumBy(itemsList, 'itemtotal');
    setTotal(itemsTotal);
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
    if (monthdays && monthdays.length > 0) {
      const bmd = monthdays.map((wd: any) => wd.value);
      setBymonthday(bmd);
    }
  }, [monthdays]);

  useEffect(() => {
    if (freq !== RRule.WEEKLY) {
      setWeekdays([]);
      setByweekday([]);
    }
  }, [freq]);

  useEffect(() => {
    if (start && end) {
      const days = getInvDays(start, end);
      setInvdays(days);
    }
  }, [start, end]);

  useEffect(() => {
    if (!isCustom) {
      const rdata = getRruleData({
        freq,
        byweekday: weekdays?.length > 0 ? byweekday : undefined,
        dtstart: start,
        until: undefined,
        interval,
        bymonthday: monthdays?.length > 0 ? bymonthday : undefined,
        count,
        isCustom,
      });
      if (isNew || isEvents) {
        const d = rdata.all[rdata.all.length - 1];
        d.setHours(9, 0, 0);
        setEnd(d);
      }
      setRrule(rdata);
    }
  }, [
    start,
    freq,
    count,
    interval,
    weekdays,
    byweekday,
    monthdays,
    bymonthday,
    isCustom,
  ]);

  useEffect(() => {
    if (start && end && isEvents) {
      const event = {
        title: tasktitle,
        startDate: start,
        endDate: end,
        amount: total,
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
        event,
        rrule,
        isRTL,
        weekdays,
        monthdays,
        isLastday,
        isatStart,
        doneEvents,
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
    total,
    isEvents,
    isatStart,
    isLastday,
    weekdays,
    bymonthday,
  ]);

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

  useEffect(() => {
    if (row && row._id) {
      getItems({ variables: { opId: row._id } });
      getDoneEvents({ variables: { contractId: row._id } });
      const depId = row.departmentId;
      const empId = row.employeeId;
      const custId = row.customerId;
      const proId = row.projectId;
      const resId = row.resourseId;
      const start = row?.start ? new Date(row?.start) : null;
      const end = row?.end ? new Date(row?.end) : null;
      setFreq(row?.freq || 1);
      setInterval(row?.interval || 1);

      if (row?.info) {
        setInfo(JSON.parse(row?.info));
      } else {
        setInfo(taskExtra);
      }

      setStart(start);
      setEnd(end);
      setTasktitle(row?.title);
      setPeriodType(
        row?.periodType
          ? row?.periodType
          : row?.freq === RRule.DAILY && row?.interval === 30
          ? 30
          : row?.freq === RRule.MINUTELY
          ? 31
          : row?.freq === RRule.WEEKLY
          ? 7
          : 1
      );
      setCount(row?.count ? row?.count : row?.evQty || 1);
      setIsEvents(row?.tasktype !== 3 ? true : false);
      setWeekdays(row?.weekdays ? JSON.parse(row?.weekdays) : []);
      setMonthdays(row?.monthdays ? JSON.parse(row?.monthdays) : []);
      setDayCost(row?.dayCost || 0);
      if (row?.periodType === 11 || row?.periodType === 33) {
        setMonthdays([{ id: 1, name: '1', nameAr: '1', value: 1 }]);
        setBymonthday([1]);
      }
      setIsCustom(row?.periodType === 100 ? true : false);
      setIsLastday(row?.periodType === 33 ? true : false);

      if (row?.periodType === 100) {
        const rdata = getRruleData({
          freq: 1,
          byweekday: null,
          dtstart: start,
          until: end,
          interval: 1,
          bymonthday: null,
          count: 1,
          isCustom: true,
        });
        setRrule(rdata);
      }

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
    setTasktitle(null);
    setSaving(false);
    setRrule(null);
    setItemsList([]);
    setCount(1);
    setInterval(1);
    setPeriodType(1);
    setFreq(RRule.DAILY);
    setTotal(0);
    setInfo(null);
    setIsEvents(false);
    setBymonthday(null);
    setIsCustom(false);
    setIsLastday(false);
    setIsatStart(false);
    setMonthdays([]);
    setDoneEvents(null);
    setDayCost(null);
    setInvdays(0);
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
    if (!itemsList || itemsList.length === 0) {
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
      _id: row && row._id ? row._id : undefined, // is it new or edit
      title: tasktitle ? tasktitle : custvalue?.name,
      start,
      end,
      amount: total * count,
      tasktype: isEvents ? 2 : 3, // 1: single event, 2: multi events, 3: no events - only items and time
      items: JSON.stringify(itemsList),
      events: isEvents ? events : null,
      customer,
      department,
      employee,
      resourse,
      project,
      info: JSON.stringify(info),
      freq,
      count,
      interval,
      periodType,
      periodCost: total,
      dayCost,
      weekdays: JSON.stringify(weekdays),
      monthdays: JSON.stringify(monthdays),
    };

    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
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
      maxWidth={'lg'}
      fullWidth
      preventclose
      saving={saving}
      canceltitle={isRTL ? 'اغلاق' : 'close'}
    >
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <CalenderLocal
                  label={words.start}
                  value={start}
                  onChange={(d: any) => setStart(d)}
                  format="dd/MM/yyyy"
                  mb={0}
                  style={{
                    marginTop: 0,
                    width: 180,
                  }}
                ></CalenderLocal>
              </Grid>
              <Grid item xs={3}>
                <CalenderLocal
                  value={end}
                  label={words.end}
                  onChange={(d: any) => {
                    d.setHours(9, 0, 0);
                    setEnd(d);
                    if (isCustom) {
                      const rdata = getRruleData({
                        freq: 1,
                        byweekday: null,
                        dtstart: start,
                        until: d,
                        interval: 1,
                        bymonthday: null,
                        count: 1,
                        isCustom,
                      });
                      setRrule(rdata);
                    }
                  }}
                  format="dd/MM/yyyy"
                  style={{
                    marginTop: 0,
                    width: 180,
                  }}
                  mb={0}
                ></CalenderLocal>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}
                >{`( ${invdays} ${isRTL ? 'يوم' : 'Day'} )`}</Typography>
              </Grid>
              <Grid item xs={4} style={{ marginTop: 15 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isEvents}
                      onChange={() => {
                        setIsEvents(!isEvents);
                        setIsatStart(false);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      style={{
                        color: theme.palette.primary.main,
                        marginTop: 5,
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                      variant="subtitle1"
                    >
                      {isRTL ? 'تفعيل المواعيد' : 'Activate Appointments'}
                    </Typography>
                  }
                />
                {isEvents && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isatStart}
                        onChange={() => setIsatStart(!isatStart)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography
                        style={{
                          color: theme.palette.primary.main,
                          marginTop: 5,
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                        variant="subtitle1"
                      >
                        {isRTL ? 'مع بداية الفترة' : 'At Beginning'}
                      </Typography>
                    }
                  />
                )}
              </Grid>
              <Grid item xs={3} style={{ marginTop: 10 }}>
                <SelectLocal
                  options={intervalOptions}
                  value={periodType}
                  onChange={onChangePeriodType}
                  isRTL={isRTL}
                  disabled={!isEvents}
                  width={195}
                ></SelectLocal>
              </Grid>

              {!isCustom && freq === RRule.WEEKLY && (
                <Grid item xs={3} style={{ marginTop: 18 }}>
                  <SelectMulti
                    options={byweekdayOptions}
                    value={weekdays}
                    setValue={setWeekdays}
                    words={words}
                    isRTL={isRTL}
                    name="weekdays"
                    disabled={!isEvents}
                    fullWidth
                    mb={0}
                  ></SelectMulti>
                </Grid>
              )}
              {!isCustom && freq === RRule.MONTHLY && periodType === 31 && (
                <Grid item xs={3} style={{ marginTop: 18 }}>
                  <SelectMulti
                    options={monthdaysOptions}
                    value={monthdays}
                    setValue={setMonthdays}
                    words={words}
                    isRTL={isRTL}
                    name="monthdays"
                    disabled={!isEvents}
                    fullWidth
                    mb={0}
                  ></SelectMulti>
                </Grid>
              )}
              {!isCustom && (
                <Grid item xs={3} style={{ marginTop: 10 }}>
                  <TextFieldLocal
                    required
                    name="count"
                    label={words.qty}
                    value={count}
                    onChange={onChangeCount}
                    type="number"
                    fullWidth
                    disabled={!isEvents}
                    mb={0}
                  />
                </Grid>
              )}
              {!isCustom && (
                <Grid item xs={3} style={{ marginTop: 10 }}>
                  <TextFieldLocal
                    required
                    name="interval"
                    label={words.interval}
                    value={interval}
                    onChange={onChangeInterval}
                    type="number"
                    fullWidth
                    disabled={!isEvents}
                    mb={0}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
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
              <Grid item xs={12}>
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

              <Grid item xs={3}>
                <TextFieldLocal
                  name="total"
                  label={words.total}
                  type="number"
                  value={total}
                  onChange={() => null}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>

              <Grid item xs={6}></Grid>
              <Grid item xs={3}>
                <TextFieldLocal
                  name="amount"
                  label={words.amount}
                  type="number"
                  value={total * count}
                  onChange={() => null}
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
          <Grid item xs={4} style={{ marginTop: 10 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextFieldLocal
                      name="dayCost"
                      label={words.dayCost}
                      value={dayCost}
                      onChange={onChangeDayCost}
                      type="number"
                      fullWidth
                      mb={0}
                    />
                  </Grid>
                  <Grid item xs={6}></Grid>
                  {info?.map((extra: any) => (
                    <Grid item xs={extra.multiline ? 12 : 6}>
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

              <Grid item xs={12}>
                {rrule?.all && isEvents && (
                  <Paper
                    style={{
                      height: 270,
                      overflow: 'auto',
                    }}
                    elevation={3}
                  >
                    <Box style={{ flexDirection: 'row' }}>
                      {rrule?.all?.map((al: any, index: any) => {
                        const isfrom = weekdays?.[0] || monthdays?.[0];
                        if (!isfrom) {
                          if (!isatStart && index === 0) {
                            return null;
                          }
                          if (isatStart && index === rrule?.all?.length - 1) {
                            return null;
                          }
                        }
                        const al2 = new Date(al);
                        if (isLastday && al2.getDate() === 1) {
                          al2.setDate(al2.getDate() - 1);
                        }

                        return (
                          <Box
                            display="flex"
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: '#f5f5f5',
                              margin: 10,
                              padding: 10,
                            }}
                          >
                            <Typography>
                              {getDateDayWeek(isLastday ? al2 : al, isRTL)}
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

export default PopupTaskFull;
