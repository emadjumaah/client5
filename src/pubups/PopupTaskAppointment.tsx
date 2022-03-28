/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { messageAlert } from '../Shared';
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
import { eventStatus, weekdaysNNo } from '../constants/datatypes';
import ServiceItemForm from '../Shared/ServiceItemForm';
import ItemsTable from '../Shared/ItemsTable';
import { invoiceClasses } from '../themes/classes';
import {
  actionTypeFormatter,
  getDateDayTimeFormat,
  getDateDayWeek,
  moneyFormat,
} from '../Shared/colorFormat';
import PopupAddMultiEvents from './PopupAddMultiEvents';
import { getEventsList } from '../common/helpers';
import { useCustomers, useTemplate } from '../hooks';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PopupAction from './PopupAction';
import PopupCustomer from './PopupCustomer';
import { getPopupTitle } from '../constants/menu';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import MyIcon from '../Shared/MyIcon';
import PopupMaps from './PopupMaps';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupTaskAppointment = ({
  open,
  onClose,
  row,
  isNew,
  setEnd,
  addEventsToList,
  resourses,
  employees,
  departments,
  servicesproducts,
  theme,
  department,
  customer,
  employee,
  resourse,
}: any) => {
  const classes = invoiceClasses();

  const [saving, setSaving] = useState(false);

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

  const [custvalue, setCustvalue] = useState<any>(null);

  const [status, setStatus]: any = useState(null);

  const [totals, setTotals] = useState<any>({});
  const [itemsList, setItemsList] = useState<any>([]);
  const [rrule, setRrule] = useState<any>(null);

  const [openMulti, setOpenMulti] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState(null);

  const [type, setType] = useState(null);
  const [openAction, setOpenAction] = useState(false);
  const [actionslist, setActionslist] = useState([]);
  // const [daction, setDaction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tasktitle, setTasktitle]: any = useState(null);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const { customers, addCustomer, editCustomer } = useCustomers();

  const { addDepartment, editDepartment } = useDepartmentsUp();
  const { addEmployee, editEmployee } = useEmployeesUp();
  const { addResourse, editResourse } = useResoursesUp();
  const { tempwords, tempoptions } = useTemplate();

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

  useEffect(() => {
    if (isemployee) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user, employees]);

  useEffect(() => {
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
    setResovalue(resourse);
  }, [open]);

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
    getOverallTotal();
  }, [itemsList]);
  useEffect(() => {
    if (rrule?.all && rrule?.all?.length > 0) {
      setEnd(rrule.all[rrule.all.length - 1]);
    }
  }, [rrule]);

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
    setLocation(null);
    setStatus(null);
    setRrule(null);
    setItemsList([]);
    setTotals({});
    setActionslist([]);
    setSelected(null);
    setSaving(false);
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
    if (!custvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يرجى اضافة عميل' : 'Please add Customer'
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
    setSaving(true);
    const event = {
      title: tasktitle,
      startDate,
      endDate,
      location: location?.lat ? location : null,
      amount: totals.amount,
      status: status ? status.id : 2,
      // daction,
      items: JSON.stringify(itemsList),
      user: user._id,
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
    const eventlist = getEventsList({ event, rrule, actionslist, isRTL });
    addEventsToList(eventlist);
    onCloseForm();
  };

  const onCloseForm = () => {
    resetAllForms();
    onClose();
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = getPopupTitle('appointment', isNew);

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
      savetitle={isRTL ? 'متابعة' : 'Proceed'}
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
                  </Grid>

                  {!tempoptions?.noEmp && (
                    <Grid item xs={4}>
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

                  {!tempoptions?.noRes && (
                    <Grid item xs={4}>
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

                  <Grid item xs={4}>
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
                  {isRTL ? 'اضافة تنبيه' : 'Add Reminder'}
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
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      style={{ padding: 7 }}
                      checked={daction}
                      onChange={() => setDaction(!daction)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      style={{ color: theme.palette.primary.main }}
                      variant="subtitle2"
                    >
                      {isRTL ? 'تنبيه وقت الموعد' : 'Notification'}
                    </Typography>
                  }
                  style={{ fontSize: 14 }}
                /> */}
                <Paper style={{ height: 180, overflow: 'auto' }}>
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

          <Grid item xs={12} md={12}>
            <Grid container spacing={2}></Grid>

            <Box
              style={{
                backgroundColor: '#f4f4f4',
                padding: 10,
                marginTop: 15,
                marginBottom: 15,
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
              <Box style={{ marginBottom: 20 }}>
                <ItemsTable
                  height={200}
                  rows={itemsList}
                  editItem={editItemInList}
                  removeItem={removeItemFromList}
                  isRTL={isRTL}
                  words={words}
                  user={user}
                ></ItemsTable>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {words.total} : {moneyFormat(totals.amount)}
                </Typography>
                <Box style={{ marginTop: 20 }}>
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
                <Box
                  m={1}
                  display="flex"
                  style={{ flex: 1, justifyContent: 'flex-end' }}
                >
                  <Button
                    size="medium"
                    color="primary"
                    variant="contained"
                    onClick={() => setOpenMap(true)}
                  >
                    {isRTL ? 'الموقع الجغرافي' : 'Location'}
                  </Button>
                  {location?.lat && (
                    <>
                      <MyIcon
                        size={32}
                        color="#ff80ed"
                        icon="location"
                      ></MyIcon>
                      <Box
                        onClick={() => setLocation(null)}
                        style={{ cursor: 'pointer', padding: 4 }}
                      >
                        <MyIcon size={28} color="#777" icon="close"></MyIcon>
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Button
                  style={{ minWidth: 100, marginTop: 5 }}
                  variant="outlined"
                  onClick={() => setOpenMulti(true)}
                >
                  {isRTL ? 'تكرار' : 'Repeate'}
                </Button>
                <Button
                  style={{ minWidth: 100, marginTop: 5 }}
                  variant="outlined"
                  onClick={() => setRrule(null)}
                >
                  {isRTL ? 'الغاء التكرار' : 'Cancel Repeate'}
                </Button>
              </Grid>
              <Grid item xs={5}>
                {rrule?.all && (
                  <Paper
                    style={{
                      maxHeight: 150,
                      overflow: 'auto',
                      minHeight: 150,
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
            </Grid>
            <PopupAddMultiEvents
              start={startDate}
              open={openMulti}
              onClose={() => setOpenMulti(false)}
              onSubmit={setRrule}
              theme={theme}
              isRTL={isRTL}
              words={words}
            ></PopupAddMultiEvents>

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
            <PopupMaps
              open={openMap}
              onClose={() => setOpenMap(false)}
              isRTL={isRTL}
              theme={theme}
              location={location}
              setLocation={setLocation}
            ></PopupMaps>
          </Grid>
        </Grid>
      </>
    </PopupLayout>
  );
};

export default PopupTaskAppointment;
