/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Paper, Typography } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { weekdaysNNo } from '../constants/datatypes';
import { getDateDayWeek } from '../Shared/colorFormat';
import { useCustomers, useTemplate } from '../hooks';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import PopupAddrRule from './PopupAddrRule';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import { freqOptions } from '../constants/rrule';
import RRule from 'rrule';
import { getReminderRruleData } from '../common/getRruleData';
import useTasks from '../hooks/useTasks';
import { useLazyQuery } from '@apollo/client';
import getOperationItems from '../graphql/query/getOperationItems';
import ExpensesItemForm from '../Shared/ExpensesItemForm';
import ExpensesItemsTable from '../Shared/ExpensesItemsTable';
import LoadingInline from '../Shared/LoadingInline';
import { invoiceClasses } from '../themes';
import { PriceTotal } from '../Shared/TotalPrice';

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
}: any) => {
  const classes = invoiceClasses();

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

  const [itemsList, setItemsList] = useState<any>([]);

  const [totals, setTotals] = useState<any>({});

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [actionslist, setActionslist] = useState([]);
  const [rtitle, setRtitle]: any = useState(null);
  const [loading, setLoading] = useState(false);

  const [freq, setFreq] = useState(RRule.DAILY);
  const [count, setCount] = useState(1);

  const { customers } = useCustomers();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { tempwords, tempoptions } = useTemplate();
  const { tasks } = useTasks();

  const { register, handleSubmit } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

  const isemployee = user?.isEmployee && user?.employeeId;

  const onChangeFreq = (e: any) => {
    const value = e.target.value;
    setFreq(value);
  };

  const onChangeCount = (e: any) => {
    const value = Number(e.target.value);
    const count = value < 1 ? 1 : value > 365 ? 365 : value;
    setCount(count);
  };

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
    if (isNew) {
      const start = new Date();
      start.setMinutes(0);
      start.setHours(start.getHours() + 1);
      setRuntime(start);
    }
  }, [open]);

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

  const resetAllForms = () => {
    setRuntime(null);
    setCustvalue(null);
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
    setRrule(null);
    setActionslist([]);
    setTaskvalue(null);
    setSaving(false);
    setRtitle(null);
    setFreq(RRule.DAILY);
    setCount(1);
    setItemsList([]);
    setLoading(false);
  };

  const addItemToList = (item: any) => {
    const newArray = [...itemsList, { ...item, userId: user._id }];
    const listwithindex = indexTheList(newArray);
    setItemsList(listwithindex);
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
    const { amount } = totals;

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
      items: JSON.stringify(itemsList),
      amount,
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
                        isRTL={isRTL}
                        fullWidth
                        day={day}
                      ></AutoFieldLocal>
                    </Grid>
                  )}
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
              <Grid item xs={12}>
                {(isNew || itemsList?.length > 0) && (
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
                        options={servicesproducts}
                        addItem={addItemToList}
                        words={words}
                        classes={classes}
                        user={user}
                        isRTL={isRTL}
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
                        ></ExpensesItemsTable>
                      </Box>
                    )}
                    {loading && <LoadingInline></LoadingInline>}
                  </Box>
                )}
              </Grid>
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
