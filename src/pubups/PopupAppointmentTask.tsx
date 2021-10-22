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
  FormControlLabel,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
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

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupAppointmentTask = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  employees,
  departments,
  customers,
  servicesproducts,
  theme,
  taskId,
  employee,
  department,
  customer,
  company,
  isEditor,
}: any) => {
  const classes = invoiceClasses();

  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate]: any = useState(null);
  const [endDate, setEndDate]: any = useState(null);

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [custvalue, setCustvalue] = useState<any>(null);
  const [custError, setCustError] = useState<any>(false);
  const custRef: any = React.useRef();

  const [status, setStatus]: any = useState(null);

  const [totals, setTotals] = useState<any>({});
  const [itemsList, setItemsList] = useState<any>([]);
  const [rrule, setRrule] = useState<any>(null);

  const [openMulti, setOpenMulti] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [openAction, setOpenAction] = useState(false);
  const [actionslist, setActionslist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasktitle, setTasktitle]: any = useState(null);

  const [resKind, setResKind] = useState<any>(null);
  const [emplslist, setEmplslist] = useState<any>([]);

  const { register, handleSubmit } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

  const [loadActions, actionsData]: any = useLazyQuery(getActions, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (employees && employees.length > 0) {
      const filtered = employees.filter(
        (emp: any) => emp.resKind === resKind && emp.resType === 1
      );
      setEmplslist(filtered);
    }
  }, [resKind, employees]);

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
      setCustvalue(customer);
      setDepartvalue(department);
      setEmplvalue(employee);
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
      const custId = row.customerId;
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
      if (custId) {
        const cust = customers.filter((cu: any) => cu._id === custId)[0];
        setCustvalue(cust);
      }
      if (statNo) {
        const stat = eventStatus.filter((es: any) => es.id === statNo)[0];
        setStatus(stat);
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
    setStatus(null);
    setRrule(null);
    setItemsList([]);
    setTotals({});
    setActionslist([]);
    setSelected(null);
    setTasktitle(null);
    setResKind(null);
  };

  const onSubmit = async () => {
    // const { startPeriod, endPeriod } = getAppStartEndPeriod();
    // if (
    //   startDate < startPeriod ||
    //   startDate > endPeriod ||
    //   endDate < startPeriod ||
    //   endDate > endPeriod
    // ) {
    //   await messageAlert(
    //     setAlrt,
    //     isRTL ? "يجب تعديل التاريخ" : "Date should be change"
    //   );
    //   return;
    // }
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
      taskId,
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
    };
    const mutate = isNew ? addAction : editAction;

    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
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

  const title = isRTL
    ? isNew
      ? 'موعد جديد'
      : 'تعديل موعد'
    : isNew
    ? 'New Appointment'
    : 'Edit Appointment';
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
                  <Grid item xs={12}>
                    <AutoFieldLocal
                      name="customer"
                      title={words.customer}
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
                    ></AutoFieldLocal>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      style={{ marginRight: 10, marginTop: 0, marginBottom: 0 }}
                    >
                      <RadioGroup
                        aria-label="Views"
                        name="views"
                        row
                        value={resKind}
                        onChange={(e: any) => {
                          setResKind(Number(e.target.value));
                          setEmplvalue(null);
                        }}
                      >
                        <FormControlLabel
                          value={1}
                          control={
                            <Radio
                              style={{ padding: 0, margin: 0 }}
                              color="primary"
                            />
                          }
                          label={isRTL ? 'الموظف' : 'Employee'}
                        />

                        <FormControlLabel
                          value={2}
                          control={
                            <Radio
                              style={{ padding: 0, margin: 0 }}
                              color="primary"
                            />
                          }
                          label={isRTL ? 'المورد' : 'Resourse'}
                        />
                      </RadioGroup>
                    </Box>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <AutoFieldLocal
                      name="department"
                      title={words.department}
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
                      noPlus
                      isRTL={isRTL}
                      fullWidth
                    ></AutoFieldLocal>
                  </Grid>
                  <Grid item xs={6}>
                    <AutoFieldLocal
                      name="employee"
                      title={words.employee}
                      words={words}
                      options={emplslist}
                      disabled={!resKind}
                      value={emplvalue}
                      setSelectValue={setEmplvalue}
                      setSelectError={setEmplError}
                      selectError={emplError}
                      refernce={emplRef}
                      register={register}
                      noPlus
                      isRTL={isRTL}
                      fullWidth
                      day={day}
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
                  employees={employees}
                  departments={departments}
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
          appoint={row}
          services={servicesproducts}
          editEvent={editAction}
          company={company}
          theme={theme}
          items={itemsList}
        ></PopupAppointInvoice>
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

export default PopupAppointmentTask;
