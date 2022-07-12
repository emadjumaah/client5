/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { weekdaysNNo } from '../constants/datatypes';
import { getDateDayWeek } from '../Shared/colorFormat';
import { useTemplate } from '../hooks';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import PopupAddrRule from './PopupAddrRule';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import {
  byweekdayOptions,
  intervalOptions,
  monthdaysOptions,
} from '../constants/rrule';
import RRule from 'rrule';
import { getReminderRruleData } from '../common/getRruleData';
import { useLazyQuery } from '@apollo/client';
import getOperationItems from '../graphql/query/getOperationItems';
import ExpensesItemForm from '../Shared/ExpensesItemForm';
import ExpensesItemsTable from '../Shared/ExpensesItemsTable';
import LoadingInline from '../Shared/LoadingInline';
import { invoiceClasses } from '../themes';
import { PriceTotal } from '../Shared/TotalPrice';
import SelectMulti from '../Shared/SelectMulti';

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
  servicesproducts,
  value,
  name,
  tasks,
}: any) => {
  const classes = invoiceClasses();

  const [isItems, setIsItems] = useState(false);
  const [saving, setSaving] = useState(false);

  const [runtime, setRuntime]: any = useState(new Date());
  const [startDate, setStartDate]: any = useState(new Date());
  const [endDate, setEndDate]: any = useState(new Date());

  const [departvalue, setDepartvalue] = useState<any>(
    name === 'departmentId' ? value : null
  );
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(
    name === 'employeeId' ? value : null
  );
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [resovalue, setResovalue] = useState<any>(
    name === 'resourseId' ? value : null
  );

  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'contractId' ? value : null
  );

  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = React.useRef();

  const [rrule, setRrule] = useState<any>(null);
  const [openMulti, setOpenMulti] = useState(false);

  const [itemsList, setItemsList] = useState<any>([]);

  const [totals, setTotals] = useState<any>({});

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [actionslist, setActionslist] = useState([]);
  const [rtitle, setRtitle]: any = useState(null);
  const [loading, setLoading] = useState(false);

  const [freq, setFreq] = useState(RRule.DAILY);
  const [count, setCount] = useState(1);
  const [interval, setInterval] = useState(1);

  const [periodType, setPeriodType] = useState(1);

  const [weekdays, setWeekdays]: any = useState([]);
  const [byweekday, setByweekday] = useState([]);
  const [monthdays, setMonthdays] = useState([]);
  const [bymonthday, setBymonthday] = useState([]);
  const [isLastday, setIsLastday] = useState(false); // lastday of month

  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { tempwords, tempoptions } = useTemplate();

  const { register, handleSubmit } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

  const isemployee = user?.isEmployee && user?.employeeId;

  const onChangeInterval = (e: any) => {
    const value = Number(e.target.value);
    setInterval(value);
  };

  const onChangeCount = (e: any) => {
    const value = Number(e.target.value);
    const count = value < 1 ? 1 : value > 365 ? 365 : value;
    setCount(count);
  };

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
    const items = itemsData?.data?.['getOperationItems']?.data || [];
    if (items && items.length > 0) {
      const ids = items.map((it: any) => it.itemId);
      const servlist = servicesproducts.filter((ser: any) =>
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
      setLoading(false);
    }
  }, [itemsData]);

  useEffect(() => {
    if (row && row._id) {
      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;

      setRtitle(row?.title);
      setRuntime(new Date(row?.runtime));
      setStartDate(new Date(row?.startDate));
      setEndDate(new Date(row?.endDate));
      if (row.freq) {
        setFreq(row.freq);
      }
      if (row.count) {
        setCount(row.count);
      }
      if (row.interval) {
        setInterval(row.interval);
      }

      setLoading(true);
      const variables = { opId: row._id };
      getItems({
        variables,
      });

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
      if (row?.actions) {
        setActionslist(JSON.parse(row?.actions));
      }
      if (row?.rruledata) {
        setRrule(JSON.parse(row?.rruledata));
      }
    }
  }, [row]);

  const getOverallTotal = () => {
    const totalsin = itemsList.map((litem: any) => litem.itemtotal);
    const amount = totalsin.reduce((psum: any, a: any) => psum + a, 0);
    setTotals({ amount });
  };

  useEffect(() => {
    getOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (isemployee) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user, employees]);

  useEffect(() => {
    const rdata = getReminderRruleData({
      freq,
      dtstart: startDate,
      until: undefined,
      interval,
      byweekday: weekdays?.length > 0 ? byweekday : undefined,
      bymonthday: monthdays?.length > 0 ? bymonthday : undefined,
      count,
    });
    setRrule(rdata);
  }, [
    isNew,
    startDate,
    freq,
    count,
    interval,
    freq,
    count,
    interval,
    weekdays,
    byweekday,
    monthdays,
    bymonthday,
  ]);

  const resetAllForms = () => {
    setRuntime(null);
    setRrule(null);
    setActionslist([]);
    setRtitle(null);
    setLoading(false);
    setSaving(false);
    setItemsList([]);
    setCount(1);
    setInterval(1);
    setPeriodType(1);
    setFreq(RRule.DAILY);
    setBymonthday(null);
    setMonthdays([]);
    setDepartvalue(name === 'departmentId' ? value : null);
    setEmplvalue(name === 'employeeId' ? value : null);
    setResovalue(name === 'resourseId' ? value : null);
    setTaskvalue(name === 'contractId' ? value : null);
  };

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

  const onSubmit = async () => {
    if (!rtitle) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يرجى اضافة البيان' : 'Please add title'
      );
      return;
    }
    setSaving(true);

    const amount = totals?.amount;

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      title: rtitle,
      startDate,
      endDate,
      runtime,
      rRule: rrule?.str,
      rruledata: rrule ? JSON.stringify(rrule) : undefined,
      actions: actionslist ? JSON.stringify(actionslist) : undefined,
      departmentId: departvalue ? departvalue._id : undefined,
      employeeId: emplvalue ? emplvalue._id : undefined,
      resourseId: resovalue ? resovalue._id : undefined,
      contractId: taskvalue ? taskvalue._id : undefined,
      items: itemsList ? JSON.stringify(itemsList) : undefined,
      amount,
      freq,
      count,
      interval,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      setSaving(false);
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

  const onChangePeriodType = (e: any) => {
    const value = e.target.value;
    setPeriodType(value);
    if (value === 1) {
      setFreq(RRule.DAILY);
      setInterval(value);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 7) {
      setFreq(RRule.WEEKLY);
      setInterval(1);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 30) {
      setFreq(RRule.DAILY);
      setInterval(value);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 31) {
      setFreq(RRule.MONTHLY);
      setInterval(1);
      setMonthdays([]);
      setBymonthday([]);
    } else if (value === 11) {
      setFreq(1);
      setInterval(1);
      setMonthdays([{ id: 1, name: '1', nameAr: '1', value: 1 }]);
      setBymonthday([1]);
      setIsLastday(false);
    } else if (value === 33) {
      setFreq(1);
      setInterval(1);
      setMonthdays([{ id: 1, name: '1', nameAr: '1', value: 1 }]);
      setBymonthday([1]);
      setIsLastday(true);
    }
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
                  <Grid item xs={12}>
                    <CalenderLocal
                      isRTL={isRTL}
                      label={words.time}
                      value={startDate}
                      onChange={(d: any) => {
                        setStartDate(d);
                        setRuntime(d);
                        setEndDate(d);
                      }}
                      format="dd/MM/yyyy - hh:mm"
                      time
                    ></CalenderLocal>
                  </Grid>

                  <Grid item xs={3}>
                    <SelectLocal
                      options={intervalOptions.filter(
                        (io: any) => io.id !== 100
                      )}
                      value={periodType}
                      onChange={onChangePeriodType}
                      isRTL={isRTL}
                      width={145}
                    ></SelectLocal>
                  </Grid>
                  {freq === RRule.WEEKLY && (
                    <Grid item xs={3} style={{ marginTop: 8 }}>
                      <SelectMulti
                        options={byweekdayOptions}
                        value={weekdays}
                        setValue={setWeekdays}
                        words={words}
                        isRTL={isRTL}
                        name="weekdays"
                        fullWidth
                        mb={0}
                      ></SelectMulti>
                    </Grid>
                  )}
                  {freq === RRule.MONTHLY && periodType === 31 && (
                    <Grid item xs={3} style={{ marginTop: 8 }}>
                      <SelectMulti
                        options={monthdaysOptions}
                        value={monthdays}
                        setValue={setMonthdays}
                        words={words}
                        isRTL={isRTL}
                        name="monthdays"
                        fullWidth
                        mb={0}
                      ></SelectMulti>
                    </Grid>
                  )}
                  <Grid item xs={3}>
                    <TextFieldLocal
                      required
                      name="count"
                      label={words.qty}
                      value={count}
                      onChange={onChangeCount}
                      type="number"
                      fullWidth
                      mb={0}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextFieldLocal
                      required
                      name="interval"
                      label={words.interval}
                      value={interval}
                      onChange={onChangeInterval}
                      type="number"
                      fullWidth
                      mb={0}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: 10 }}></Grid>
                  {!tempoptions?.noRes && (
                    <Grid item xs={6}>
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
                        isRTL={isRTL}
                        fullWidth
                        day={day}
                        mb={0}
                        disabled={name === 'resourseId'}
                      ></AutoFieldLocal>
                    </Grid>
                  )}
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
                        isRTL={isRTL}
                        fullWidth
                        day={day}
                        mb={0}
                      ></AutoFieldLocal>
                    </Grid>
                  )}
                  {!tempoptions?.noTsk && (
                    <Grid item xs={6}>
                      <AutoFieldLocal
                        name="task"
                        title={tempwords?.task}
                        words={words}
                        options={tasks}
                        value={taskvalue}
                        setSelectValue={setTaskvalue}
                        isRTL={isRTL}
                        fullWidth
                        disabled={name === 'contractId'}
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
                      isRTL={isRTL}
                      fullWidth
                      disabled={name === 'departmentId'}
                      mb={0}
                    ></AutoFieldLocal>
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                {rrule?.all && (
                  <Paper
                    elevation={2}
                    style={{
                      height: 250,
                      overflow: 'auto',
                    }}
                  >
                    <Box style={{ flexDirection: 'row' }}>
                      {rrule?.all?.map((al: any, index: any) => {
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
                              margin: 5,
                              padding: 5,
                            }}
                          >
                            <Typography>
                              {getDateDayWeek(isLastday ? al2 : al, isRTL)}
                            </Typography>
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
              <Grid item xs={12}>
                <TextFieldLocal
                  name="rtitle"
                  multiline
                  rows={3}
                  label={words.description}
                  value={rtitle}
                  onChange={(e: any) => setRtitle(e.target.value)}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isItems}
                      onChange={() => {
                        setIsItems(!isItems);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      style={{
                        color: theme.palette.primary.main,
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                      variant="subtitle1"
                    >
                      {isRTL ? 'تفعيل المصاريف' : 'Activate Expenses'}
                    </Typography>
                  }
                />
              </Grid>
              {isItems && (
                <Grid item xs={12}>
                  <Box
                    style={{
                      backgroundColor: '#f3f3f3',
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Box
                      display="flex"
                      style={{ paddingLeft: 10, paddingRight: 10 }}
                    >
                      <ExpensesItemForm
                        items={servicesproducts}
                        addItem={addItemToList}
                        words={words}
                        classes={classes}
                        user={user}
                        isRTL={isRTL}
                        setAlrt={setAlrt}
                      ></ExpensesItemForm>
                    </Box>
                    {!loading && (
                      <Box style={{ marginBottom: 20 }}>
                        <ExpensesItemsTable
                          rows={itemsList}
                          editItem={editItemInList}
                          removeItem={removeItemFromList}
                          isRTL={isRTL}
                          words={words}
                          user={user}
                          products={servicesproducts}
                        ></ExpensesItemsTable>
                      </Box>
                    )}
                    {loading && <LoadingInline></LoadingInline>}
                  </Box>
                </Grid>
              )}
              {isItems && (
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginRight: 10,
                      marginLeft: 10,
                    }}
                  >
                    <PriceTotal
                      amount={totals?.amount ? totals?.amount : row?.amount}
                      total={totals?.total}
                      words={words}
                      totalonly
                    ></PriceTotal>
                  </Box>
                </Grid>
              )}
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
          </Grid>
        </Grid>
      </>
    </PopupLayout>
  );
};

export default PopupReminder;
