/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { PopupCustomer } from '../../../pubups';
import { GContextTypes } from '../../../types';
import { GlobalContext } from '../../../contexts';
import { StatusSelect } from './StatusSelect';
import { Grid } from '@material-ui/core';
import { CalenderLocal, TextFieldLocal } from '../../../components';
import AutoFieldLocal from '../../../components/fields/AutoFieldLocal';
import { weekdaysNNo } from '../../../constants/datatypes';
import { setRowFromAppointment } from '../../../common/calendar';
import { useLazyQuery } from '@apollo/client';
import { getActions, getOperationItems } from '../../../graphql';
import ServiceItemForm from '../../../Shared/ServiceItemForm';
import ItemsTable from '../../../Shared/ItemsTable';
import LoadingInline from '../../../Shared/LoadingInline';
import { invoiceClasses } from '../../../themes';
import {
  actionTypeFormatter,
  getDateDayTimeFormat,
  moneyFormat,
} from '../../../Shared/colorFormat';
import { useCustomers, useTemplate } from '../../../hooks';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PopupAction from '../../../pubups/PopupAction';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

export const AppointForm = (props: any) => {
  const {
    onFieldChange,
    appointmentData,
    departments,
    tasks,
    employees,
    resourses,
    theme,
    servicesproducts,
  } = props;

  const row = setRowFromAppointment(appointmentData);

  const classes = invoiceClasses();

  const [openCust, setOpenCust] = useState(false);

  const [startDate, setStartDate]: any = useState(row?.startDate);
  const [endDate, setEndDate]: any = useState(row?.endDate);

  const [status, setStatus] = useState(row?.status || 2);

  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState<any>({});
  const [itemsList, setItemsList] = useState<any>([]);

  const [taskvalue, setTaskvalue] = useState<any>(null);
  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [resovalue, setResovalue] = useState<any>(null);

  const [openAction, setOpenAction] = useState(false);
  const [actionslist, setActionslist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasktitle, setTasktitle]: any = useState();

  const { customers, addCustomer, editCustomer } = useCustomers();
  const { tempwords, tempoptions } = useTemplate();

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const [newtext, setNewtext] = useState('');

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

  const [loadActions, actionsData]: any = useLazyQuery(getActions, {
    fetchPolicy: 'cache-and-network',
  });
  const isemployee = user?.isEmployee && user?.employeeId;

  useEffect(() => {
    if (isemployee) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user]);

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
    getOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (row && row._id) {
      setLoading(true);
      getItems({ variables: { opId: row._id } });
      loadActions({ variables: { eventId: row.id } });
      if (row.taskId) {
        const tks = tasks.filter((t: any) => t.id === row.taskId)?.[0];
        setTaskvalue(tks);
      }
      if (row.employee) {
        const empl = employees.filter(
          (emp: any) => emp._id === row?.employee?._id
        )?.[0];
        setEmplvalue(empl);
      }
      if (row.resourse) {
        const empl = resourses.filter(
          (emp: any) => emp._id === row?.resourse?._id
        )?.[0];
        setResovalue(empl);
      }
    }
  }, []);

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
    onFieldChange({ amount });
    onFieldChange({ items: JSON.stringify(itemsList) });
  };

  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext('');
  };

  const onNewFieldChange = (nextValue: any, name: any) => {
    onFieldChange({ [name]: nextValue });
  };

  useEffect(() => {
    if (!row.status) {
      onNewFieldChange(2, 'status');
    }
  }, [row.status]);
  useEffect(() => {
    const title = row.title
      ? row.title
      : tasktitle
      ? tasktitle
      : isRTL
      ? itemsList?.[0]?.nameAr
      : itemsList?.[0]?.name;
    setTasktitle(title);
    onNewFieldChange(title, 'title');
  }, [row.title, itemsList]);

  const selectCustomer = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        customerId: undefined,
        customerName: undefined,
        customerNameAr: undefined,
        customerPhone: undefined,
      };
      onNewFieldChange(value, 'customerId');
      onNewFieldChange(value, 'customerName');
      onNewFieldChange(value, 'customerNameAr');
      onNewFieldChange(value, 'customerPhone');
    }
    onNewFieldChange(newValue, 'customer');
  };
  const selectDepartment = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        departmentId: undefined,
        departmentName: undefined,
        departmentNameAr: undefined,
        departmentColor: undefined,
      };
      onNewFieldChange(value, 'departmentId');
      onNewFieldChange(value, 'departmentName');
      onNewFieldChange(value, 'departmentNameAr');
      onNewFieldChange(value, 'departmentColor');
    }
    onNewFieldChange(newValue, 'department');
  };
  const selectEmployee = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        employeeId: undefined,
        employeeName: undefined,
        employeeNameAr: undefined,
        employeeColor: undefined,
      };
      onNewFieldChange(value, 'employeeId');
      onNewFieldChange(value, 'employeeName');
      onNewFieldChange(value, 'employeeNameAr');
      onNewFieldChange(value, 'employeeColor');
    }
    onNewFieldChange(newValue, 'employee');
    setEmplvalue(newValue);
  };
  const selectResourse = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        resourseId: undefined,
        resourseName: undefined,
        resourseNameAr: undefined,
        resourseColor: undefined,
      };
      onNewFieldChange(value, 'resourseId');
      onNewFieldChange(value, 'resourseName');
      onNewFieldChange(value, 'resourseNameAr');
      onNewFieldChange(value, 'resourseColor');
    }
    onNewFieldChange(newValue, 'resourse');
    setResovalue(newValue);
  };
  const selectTask = (value: any) => {
    let newValue = value?.id;
    setTaskvalue(value);
    onNewFieldChange(newValue ? newValue : null, 'taskId');
  };

  useEffect(() => {
    if (!row._id) {
      if (taskvalue?.employeeId) {
        const empl = employees.filter(
          (em: any) => em._id === taskvalue?.employeeId
        )?.[0];
        onNewFieldChange(empl, 'employee');
        setEmplvalue(empl);
      }
      if (taskvalue?.resourseId) {
        const empl = resourses.filter(
          (em: any) => em._id === taskvalue?.resourseId
        )?.[0];
        onNewFieldChange(empl, 'resourse');
        setResovalue(empl);
      }
      if (taskvalue) {
        if (taskvalue?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === taskvalue?.departmentId
          )?.[0];
          onNewFieldChange(dept, 'department');
        }
      }
    }
  }, [taskvalue]);

  useEffect(() => {
    if (!row._id) {
      if (emplvalue) {
        if (emplvalue?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === emplvalue?.departmentId
          )?.[0];
          onNewFieldChange(dept, 'department');
        }
      }
    }
  }, [emplvalue]);

  useEffect(() => {
    if (!row._id) {
      if (resovalue) {
        if (resovalue?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === resovalue?.departmentId
          )?.[0];
          onNewFieldChange(dept, 'department');
        }
      }
    }
  }, [resovalue]);

  useEffect(() => {
    onFieldChange({ actions: JSON.stringify(actionslist) });
  }, [actionslist]);

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

  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={8}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={2}>
              <Box>
                <Typography
                  style={{ fontWeight: 'bold', marginTop: 15 }}
                  variant="body2"
                >
                  {row?.docNo}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.start}
                value={startDate}
                onChange={(d: any) => {
                  setStartDate(d);
                  onNewFieldChange(d, 'startDate');
                }}
                format="dd/MM/yyyy - hh:mm"
                time
              ></CalenderLocal>
            </Grid>
            <Grid item xs={12} md={5}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.end}
                value={endDate}
                onChange={(d: any) => {
                  setEndDate(d);
                  onNewFieldChange(d, 'endDate');
                }}
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
                onChange={(e: any) => {
                  setTasktitle(e.target.value);
                  onNewFieldChange(e.target.value, 'title');
                }}
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
                setSelectValue={selectTask}
                isRTL={isRTL}
                fullWidth
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={6}>
              <AutoFieldLocal
                name="customer"
                title={tempwords.customer}
                words={words}
                options={customers}
                value={row.customer}
                setSelectValue={selectCustomer}
                isRTL={isRTL}
                openAdd={openCustomer}
                fullWidth
                showphone
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
                  setSelectValue={selectEmployee}
                  noPlus
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
                  value={resovalue}
                  setSelectValue={selectResourse}
                  noPlus
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
                value={row.department}
                setSelectValue={selectDepartment}
                noPlus
                isRTL={isRTL}
                fullWidth
              ></AutoFieldLocal>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box
            style={{
              backgroundColor: '#eee',
              borderRadius: 5,
              padding: 7,
              margin: 10,
            }}
          >
            <Button
              variant="outlined"
              style={{
                marginBottom: 5,
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
            <Paper style={{ height: 170, overflow: 'auto' }}>
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
                      style={{ padding: 5, margin: 5 }}
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
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box style={{ marginTop: 20 }}></Box>

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
            {!loading && (
              <Box style={{ marginBottom: 10 }}>
                <ItemsTable
                  rows={itemsList}
                  editItem={editItemInList}
                  removeItem={removeItemFromList}
                  isRTL={isRTL}
                  words={words}
                  user={user}
                ></ItemsTable>
              </Box>
            )}
            {loading && <LoadingInline></LoadingInline>}
          </Box>
          <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
            {words.total} : {moneyFormat(totals.amount)}
          </Typography>
          <Box style={{ marginTop: 10 }}>
            <StatusSelect
              status={status}
              setStatus={setStatus}
              onNewFieldChange={onNewFieldChange}
              isRTL={isRTL}
              title={words.status}
            ></StatusSelect>
          </Box>
        </Grid>

        <PopupCustomer
          newtext={newtext}
          open={openCust}
          onClose={onCloseCustomer}
          isNew={true}
          setNewValue={onNewFieldChange}
          row={null}
          addAction={addCustomer}
          editAction={editCustomer}
        ></PopupCustomer>
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
      </Grid>
    </>
  );
};
