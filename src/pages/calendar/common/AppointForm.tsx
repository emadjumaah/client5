/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
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
import { useCustomers } from '../../../hooks';
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

  const [openAction, setOpenAction] = useState(false);
  const [actionslist, setActionslist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasktitle, setTasktitle]: any = useState();

  const [resKind, setResKind] = useState<any>(null);
  const [emplslist, setEmplslist] = useState<any>([]);

  const { customers, addCustomer, editCustomer } = useCustomers();

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

  useEffect(() => {
    if (user && user?.isEmployee && user?.employeeId) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user]);

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
  const selectTask = (value: any) => {
    let newValue = value?.id;
    setTaskvalue(value);
    onNewFieldChange(newValue, 'taskId');
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
      <Box>
        <Typography style={{ fontWeight: 'bold' }} variant="body2">
          {row?.docNo}
        </Typography>
      </Box>
      <Grid container spacing={0}>
        <Grid item xs={8}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
                name="customer"
                title={words.customer}
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
            <Grid item xs={6}>
              <AutoFieldLocal
                name="task"
                title={words.task}
                words={words}
                options={tasks}
                value={taskvalue}
                setSelectValue={selectTask}
                isRTL={isRTL}
                fullWidth
              ></AutoFieldLocal>
            </Grid>
            {(!user?.isEmployee || !user?.employeeId) && (
              <Grid item xs={6}>
                <Box style={{ marginRight: 10, marginTop: 0, marginBottom: 0 }}>
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
            )}
            {(!user?.isEmployee || !user?.employeeId) && (
              <Grid item xs={6}></Grid>
            )}
            <Grid item xs={6}>
              <AutoFieldLocal
                name="employee"
                title={words.employee}
                words={words}
                options={emplslist}
                disabled={!resKind}
                value={emplvalue}
                setSelectValue={selectEmployee}
                noPlus
                isRTL={isRTL}
                fullWidth
                day={day}
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={6}>
              <AutoFieldLocal
                name="department"
                title={words.department}
                words={words}
                options={departments.filter((dep: any) => dep.depType === 1)}
                value={row.department}
                setSelectValue={selectDepartment}
                noPlus
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
            backgroundColor: '#eee',
            borderRadius: 5,
            padding: 7,
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
                employees={employees}
                departments={departments}
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
