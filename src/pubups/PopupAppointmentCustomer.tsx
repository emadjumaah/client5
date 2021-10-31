/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  Button,
  colors,
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
import { eventStatus, weekdaysNNo } from '../constants/datatypes';
// import { getAppStartEndPeriod } from "../common/time";
import ServiceItemForm from '../Shared/ServiceItemForm';
import ItemsTable from '../Shared/ItemsTable';
import LoadingInline from '../Shared/LoadingInline';
import { useLazyQuery } from '@apollo/client';
import { getActions, getOperationItems } from '../graphql';
import { invoiceClasses } from '../themes/classes';
import {
  actionTypeFormatter,
  getDateDayTimeFormat,
  moneyFormat,
} from '../Shared/colorFormat';
import PopupAddMultiEvents from './PopupAddMultiEvents';
import PopupAppointInvoice from './PopupAppointInvoice';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PopupAction from './PopupAction';
import { getPopupTitle } from '../constants/menu';
import { useCustomers, useTemplate } from '../hooks';
import PopupCustomer from './PopupCustomer';
import PopupDeprtment from './PopupDeprtment';
import PopupTask from './PopupTask';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import useTasks from '../hooks/useTasks';
import useProjects from '../hooks/useProjects';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupAppointmentCustomer = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  resourses,
  employees,
  departments,
  customers,
  servicesproducts,
  theme,
  company,
  isEditor,
  tasks,
  name,
  value,
}: any) => {
  const classes = invoiceClasses();
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate]: any = useState(null);
  const [endDate, setEndDate]: any = useState(null);

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
  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = React.useRef();

  const [custvalue, setCustvalue] = useState<any>(
    name === 'customerId' ? value : null
  );
  const [custError, setCustError] = useState<any>(false);
  const custRef: any = React.useRef();

  const [status, setStatus]: any = useState(null);

  const [totals, setTotals] = useState<any>({});
  const [itemsList, setItemsList] = useState<any>([]);
  const [rrule, setRrule] = useState<any>(null);

  const [openMulti, setOpenMulti] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'taskId' ? value : null
  );

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [openAction, setOpenAction] = useState(false);
  const [actionslist, setActionslist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasktitle, setTasktitle]: any = useState(null);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);
  const [openTsk, setOpenTsk] = useState(false);

  const { addCustomer, editCustomer } = useCustomers();
  const { addDepartment, editDepartment } = useDepartmentsUp();
  const { addEmployee, editEmployee } = useEmployeesUp();
  const { addResourse, editResourse } = useResoursesUp();
  const { addTask, editTask } = useTasks();
  const { tempwords, tempoptions } = useTemplate();
  const { projects } = useProjects();

  const { register, handleSubmit } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const isemployee = user?.isEmployee && user?.employeeId;

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

  const [loadActions, actionsData]: any = useLazyQuery(getActions, {
    fetchPolicy: 'cache-and-network',
  });

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
  const openTask = () => {
    setOpenTsk(true);
  };
  const onCloseTask = () => {
    setOpenTsk(false);
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
  const onNewEmplChange = (nextValue: any) => {
    setEmplvalue(nextValue);
  };
  const onNewResoChange = (nextValue: any) => {
    setResovalue(nextValue);
  };
  const onNewTaskChange = (nextValue: any) => {
    setTaskvalue(nextValue);
  };

  useEffect(() => {
    if (isemployee) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user, employees]);

  useEffect(() => {
    if (isNew && !isemployee) {
      if (taskvalue) {
        if (taskvalue?.departmentId && name !== 'departmentId') {
          const dept = departments.filter(
            (dep: any) => dep._id === taskvalue?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
        if (taskvalue?.employeeId && name !== 'employeeId') {
          const dept = employees.filter(
            (dep: any) => dep._id === taskvalue?.employeeId
          )?.[0];
          setEmplvalue(dept);
        }
        if (taskvalue?.resourseId && name !== 'resourseId') {
          const dept = resourses.filter(
            (dep: any) => dep._id === taskvalue?.resourseId
          )?.[0];
          setResovalue(dept);
        }
      }
    }
  }, [taskvalue]);

  useEffect(() => {
    if (isNew) {
      if (emplvalue) {
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
      if (resovalue) {
        if (resovalue?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === resovalue?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
      }
    }
  }, [resovalue]);

  useEffect(() => {
    const items = itemsData?.data?.['getOperationItems']?.data || [];
    const actions = actionsData?.data?.['getActions']?.data || [];

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
          // itemtotalcost: item.qty * serv.cost,
        };
      });
      itemsWqtyprice.sort((a: any, b: any) =>
        a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
      );
      setItemsList(itemsWqtyprice);

      const listwithindex = indexTheList(actions);
      setActionslist(listwithindex);
      setLoading(false);
    }
  }, [itemsData, actionsData]);

  useEffect(() => {
    if (isNew) {
      const start = new Date();
      const end = new Date();
      start.setMinutes(0);
      end.setHours(end.getHours() + 1);
      end.setMinutes(0);
      setStartDate(start);
      setEndDate(end);
      setStatus(eventStatus.filter((es: any) => es.id === 2)?.[0]);
      if (name === 'taskId') {
        if (value?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === value?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
        if (value?.employeeId) {
          const dept = employees.filter(
            (dep: any) => dep._id === value?.employeeId
          )?.[0];
          setEmplvalue(dept);
        }
        if (value?.resourseId) {
          const dept = resourses.filter(
            (dep: any) => dep._id === value?.resourseId
          )?.[0];
          setResovalue(dept);
        }
        if (value?.customerId) {
          const dept = customers.filter(
            (dep: any) => dep._id === value?.customerId
          )?.[0];
          setCustvalue(dept);
        }
      }
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
    getOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (row && row._id) {
      setLoading(true);
      getItems({ variables: { opId: row._id } });
      loadActions({ variables: { eventId: row.id } });
      setTasktitle(row?.title);
      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;
      const custId = row.customerId;
      const taskId = row.taskId;
      const statNo = row.status;

      setStartDate(row?.startDate);
      setEndDate(row?.endDate);
      setRrule(row?.rRule);

      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (empId) {
        const empl = employees.filter((emp: any) => emp._id === empId)[0];
        setEmplvalue(empl);
      }
      if (resId) {
        const empl = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(empl);
      }
      if (custId) {
        const cust = customers.filter((cu: any) => cu._id === custId)[0];
        setCustvalue(cust);
      }
      if (statNo) {
        const stat = eventStatus.filter((es: any) => es.id === statNo)[0];
        setStatus(stat);
      }
      if (taskId) {
        const tsk = tasks.filter((ts: any) => ts.id === taskId)[0];
        setTaskvalue(tsk);
      }
    }
  }, [row]);

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

  const addActionToList = (item: any) => {
    const newArray = [...actionslist, item];
    const listwithindex = indexTheList(newArray);
    setActionslist(listwithindex);
  };
  const editActionInList = (item: any) => {
    const newArray = actionslist.map((it: any) => {
      if (it._id === item._id) {
        return item;
      } else {
        return it;
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

  const getOverallTotal = () => {
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

  const resetAllForms = () => {
    setStartDate(null);
    setEndDate(null);
    setCustvalue(null);
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
    setStatus(null);
    setRrule(null);
    setItemsList([]);
    setTotals({});
    setActionslist([]);
    setSelected(null);
    setTasktitle(null);
  };

  const onSubmit = async () => {
    if (startDate > endDate) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }
    if (new Date(startDate).getDate() !== new Date(endDate).getDate()) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }

    if (!itemsList || itemsList.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `يجب اضافة عنصر (خدمة او منتج) واحد للفاتورة على الأقل`
          : `You should add min one service to invoice`
      );
      return;
    }

    const rRule = rrule?.str ? rrule?.str : undefined;
    const title = tasktitle
      ? tasktitle
      : isRTL
      ? itemsList?.[0]?.nameAr
      : itemsList?.[0]?.name;

    const variables: any = {
      id: row && row.id ? row.id : undefined, // is it new or edit
      title,
      startDate,
      endDate,
      amount: totals.amount,
      status: status ? status.id : 2,
      items: JSON.stringify(itemsList),
      actions: JSON.stringify(actionslist),
      rRule,
      taskId: taskvalue ? taskvalue.id : null,
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
            employeePhone: undefined,
          },
      resourse: resovalue
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
          },
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
      console.log(error);
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
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = getPopupTitle('appointment', isNew);

  const desabledSave = row.status === 10 || !isEditor;

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
      bgcolor={colors.blue[500]}
      mb={20}
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
                  <Grid item xs={12} md={6}>
                    <CalenderLocal
                      isRTL={isRTL}
                      label={words.start}
                      value={startDate}
                      onChange={(d: any) => setStartDate(d)}
                      format="dd/MM/yyyy - hh:mm"
                      time
                    ></CalenderLocal>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CalenderLocal
                      isRTL={isRTL}
                      label={words.end}
                      value={endDate}
                      onChange={(d: any) => setEndDate(d)}
                      format="dd/MM/yyyy - hh:mm"
                      time
                    ></CalenderLocal>
                  </Grid>
                  <Grid item xs={12}>
                    <TextFieldLocal
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
                      name="task"
                      title={tempwords.task}
                      words={words}
                      options={tasks}
                      value={taskvalue}
                      setSelectValue={setTaskvalue}
                      register={register}
                      isRTL={isRTL}
                      fullWidth
                      openAdd={openTask}
                      disabled={name === 'taskId'}
                    ></AutoFieldLocal>
                  </Grid>
                  <Grid item xs={6}>
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
                      openAdd={openCustomer}
                      fullWidth
                      showphone
                      disabled={name === 'customerId'}
                    ></AutoFieldLocal>
                  </Grid>

                  {!tempoptions?.noEmp && (
                    <Grid item xs={4}>
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
                        disabled={isemployee || name === 'employeeId'}
                        openAdd={openEmployee}
                        isRTL={isRTL}
                        fullWidth
                        day={day}
                      ></AutoFieldLocal>
                    </Grid>
                  )}
                  {!tempoptions?.noRes && (
                    <Grid item xs={4}>
                      <AutoFieldLocal
                        name="resourse"
                        title={tempwords.resourse}
                        words={words}
                        disabled={name === 'resourseId'}
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

                  <Grid item xs={4}>
                    <AutoFieldLocal
                      name="department"
                      title={tempwords.department}
                      words={words}
                      options={departments.filter(
                        (em: any) => em.depType === 1
                      )}
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
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  backgroundColor: '#eee',
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
                    setOpenAction(true);
                  }}
                >
                  {isRTL ? 'اضافة تنبيه' : 'Add Reminder'}
                </Button>
                <Paper style={{ height: 150, overflow: 'auto' }}>
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
          <Grid item xs={12}>
            <Grid container spacing={2}></Grid>
            <Box
              style={{
                backgroundColor: '#f4f4f4',
                padding: 10,
                marginTop: 15,
                borderRadius: 10,
              }}
            >
              <Box display="flex">
                <ServiceItemForm
                  options={servicesproducts}
                  addItem={addItemToList}
                  words={words}
                  classes={classes}
                  user={user}
                  isRTL={isRTL}
                ></ServiceItemForm>
              </Box>
              {!loading && (
                <ItemsTable
                  rows={itemsList}
                  editItem={editItemInList}
                  removeItem={removeItemFromList}
                  isRTL={isRTL}
                  words={words}
                  user={user}
                ></ItemsTable>
              )}
              {loading && <LoadingInline></LoadingInline>}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {words.total} : {moneyFormat(totals.amount)}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Box>
                  <AutoFieldLocal
                    name="status"
                    title={words.status}
                    words={words}
                    options={eventStatus}
                    value={status}
                    setSelectValue={setStatus}
                    noPlus
                    isRTL={isRTL}
                    width={200}
                  ></AutoFieldLocal>
                </Box>
              </Grid>
              <Grid item xs={4}>
                {!isNew && (
                  <Box
                    m={1}
                    display="flex"
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                  >
                    <Button
                      size="medium"
                      color="primary"
                      variant="outlined"
                      onClick={() => setOpenInvoice(true)}
                      disabled={desabledSave}
                    >
                      {words.addInvoice}
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <PopupAddMultiEvents
          open={openMulti}
          onClose={() => setOpenMulti(false)}
          onSubmit={setRrule}
          theme={theme}
          isRTL={isRTL}
          words={words}
        ></PopupAddMultiEvents>
        <PopupAppointInvoice
          open={openInvoice}
          onClose={() => setOpenInvoice(false)}
          onCloseAppoint={onCloseForm}
          appoint={row}
          services={servicesproducts}
          editEvent={editAction}
          company={company}
          theme={theme}
          items={itemsList}
        ></PopupAppointInvoice>
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
        <PopupAction
          open={openAction}
          onClose={() => setOpenAction(false)}
          row={selected}
          isNew={selected ? false : true}
          addAction={addActionToList}
          editAction={editActionInList}
          theme={theme}
          event={{ ...row, startDate, endDate }}
        ></PopupAction>
      </>
    </PopupLayout>
  );
};

export default PopupAppointmentCustomer;
