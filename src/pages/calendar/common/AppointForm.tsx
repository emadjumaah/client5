/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import { PopupCustomer, PopupDeprtment, PopupEmployee } from '../../../pubups';
import { GContextTypes } from '../../../types';
import { GlobalContext } from '../../../contexts';
import { Grid } from '@material-ui/core';
import { AlertLocal, CalenderLocal, TextFieldLocal } from '../../../components';
import AutoFieldLocal from '../../../components/fields/AutoFieldLocal';
import { eventStatus, weekdaysNNo } from '../../../constants/datatypes';
import { setRowFromAppointment } from '../../../common/calendar';
import { useLazyQuery } from '@apollo/client';
import { getOperationItems } from '../../../graphql';
import ItemsTable from '../../../Shared/ItemsTable';
import { invoiceClasses } from '../../../themes';
import { moneyFormat } from '../../../Shared/colorFormat';
import {
  useCustomers,
  useProducts,
  useServices,
  useTemplate,
} from '../../../hooks';
import PopupResourses from '../../../pubups/PopupResourses';
import useDepartments from '../../../hooks/useDepartments';
import useEmployees from '../../../hooks/useEmployees';
import useResourses from '../../../hooks/useResourses';
import useTasks from '../../../hooks/useTasks';
import PopupMaps from '../../../pubups/PopupMaps';
import { SelectLocal } from './SelectLocal';
import { eventLengthOptions } from '../../../constants/rrule';
import ServiceItemForm from '../../../Shared/ServiceItemForm';
import useRetypes from '../../../hooks/useRetypes';
import MyIcon from '../../../Shared/MyIcon';
import useProjects from '../../../hooks/useProjects';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

export const AppointForm = (props: any) => {
  const { onFieldChange, appointmentData, theme } = props;

  const row = setRowFromAppointment(appointmentData);
  const classes = invoiceClasses();
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [rtypevalue, setRtypevalue] = useState<any>(null);

  const [startDate, setStartDate]: any = useState(row?.startDate);
  const [endDate, setEndDate]: any = useState(row?.endDate);
  const [eventLength, setEventLength]: any = useState(
    eventLengthOptions[1].value
  );

  const [status, setStatus] = useState(null);

  const [totals, setTotals] = useState<any>({});
  const [itemsList, setItemsList] = useState<any>([]);
  const [isItems, setIsItems] = useState(false);

  const [custvalue, setCustvalue] = useState<any>(null);
  const [taskvalue, setTaskvalue] = useState<any>(null);
  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [departvalue, setDepartvalue] = useState<any>(null);
  const [resovalue, setResovalue] = useState<any>(null);

  const [tasktitle, setTasktitle]: any = useState();

  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState(null);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const { retypes } = useRetypes();
  const { customers, addCustomer, editCustomer } = useCustomers();
  const { tempwords, tempoptions } = useTemplate();
  const { departments, addDepartment, editDepartment } = useDepartments();
  const { employees, addEmployee, editEmployee } = useEmployees();
  const { resourses, addResourse, editResourse } = useResourses();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { services } = useServices();
  const { products } = useProducts();

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

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

  useEffect(() => {
    if (isemployee) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user]);

  useEffect(() => {
    if (row && row._id) {
      const items = itemsData?.data?.['getOperationItems']?.data || [];

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
            // itemtotalcost: item.qty * serv.cost,
          };
        });
        itemsWqtyprice.sort((a: any, b: any) =>
          a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
        );
        setItemsList(itemsWqtyprice);
        setIsItems(true);
      }
    }
  }, [itemsData]);

  useEffect(() => {
    getOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (row && row._id) {
      getItems({ variables: { opId: row._id } });
      if (row.location) {
        setLocation({ lat: row?.location?.lat, lng: row?.location?.lng });
      }
    }
  }, []);

  useEffect(() => {
    if (row && row._id) {
      if (row.contract && tasks.length > 0 && !taskvalue) {
        const tks = tasks.filter((t: any) => t._id === row.contract?._id)?.[0];
        setTaskvalue(tks);
      }
      if (row.employee && employees.length > 0 && !emplvalue) {
        const empl = employees.filter(
          (emp: any) => emp._id === row?.employee?._id
        )?.[0];
        setEmplvalue(empl);
      }
      if (row.resourse && resourses.length > 0 && !resovalue) {
        const empl = resourses.filter(
          (emp: any) => emp._id === row?.resourse?._id
        )?.[0];
        setResovalue(empl);
      }
      if (row.customer && customers.length > 0 && !custvalue) {
        const empl = customers.filter(
          (emp: any) => emp._id === row?.customer?._id
        )?.[0];
        setCustvalue(empl);
      }
      if (row.department && departments.length > 0 && !departvalue) {
        const empl = departments.filter(
          (emp: any) => emp._id === row?.department?._id
        )?.[0];
        setDepartvalue(empl);
      }
      if (row?.status) {
        const stat = eventStatus.filter(
          (es: any) => es.id === row?.status
        )?.[0];
        if (stat) {
          setStatus(stat);
        }
      }
      if (row?.retypeId) {
        const depart = retypes.filter(
          (dep: any) => dep._id === row.retypeId
        )[0];
        setRtypevalue(depart);
      }
    }
  }, [tasks, employees, resourses, departments, customers, retypes]);

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
    setCustvalue(newValue);
  };
  const selectRetype = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        retypeId: undefined,
        retypeName: undefined,
        retypeNameAr: undefined,
      };
      onNewFieldChange(value, 'retypeId');
      onNewFieldChange(value, 'retypeName');
      onNewFieldChange(value, 'retypeNameAr');
    }
    onNewFieldChange(newValue, 'retype');
    setRtypevalue(newValue);
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
    setDepartvalue(newValue);
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
    setTaskvalue(value);
    onNewFieldChange(value, 'contract');
    if (value?.employeeId) {
      const empl = employees.filter(
        (em: any) => em._id === value?.employeeId
      )?.[0];
      onNewFieldChange(empl, 'employee');
      setEmplvalue(empl);
    }
    if (value?.departmentId) {
      const dept = departments.filter(
        (dep: any) => dep._id === value?.departmentId
      )?.[0];
      onNewFieldChange(dept, 'department');
      setDepartvalue(dept);
    }

    if (value?.resourseId) {
      const empl = resourses.filter(
        (em: any) => em._id === value?.resourseId
      )?.[0];
      onNewFieldChange(empl, 'resourse');
      setResovalue(empl);
    }
    if (value?.customerId) {
      const cust = customers.filter(
        (ct: any) => ct._id === value?.customerId
      )?.[0];
      onNewFieldChange(cust, 'customer');
      setCustvalue(cust);
    }
    if (value?.projectId) {
      const proj = projects.filter(
        (ct: any) => ct._id === value?.projectId
      )?.[0];
      onNewFieldChange(proj, 'project');
      setCustvalue(proj);
    }
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
      setEventLength(eventLengthOptions[0].value);
    }
  }, []);

  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  return (
    <Box p={1}>
      <Box style={{ position: 'absolute', top: 50, left: 30 }}>
        <Typography
          style={{ fontWeight: 'bold', marginTop: 15 }}
          variant="body2"
        >
          {row?.docNo}
        </Typography>
      </Box>
      <Grid container spacing={0}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                  <CalenderLocal
                    isRTL={isRTL}
                    label={words.start}
                    value={startDate}
                    onChange={(d: any) => {
                      setStartDate(d);
                      onNewFieldChange(d, 'startDate');
                      const end = eventLength
                        ? new Date(d).getTime() + eventLength * 60 * 1000
                        : null;
                      if (end) {
                        setEndDate(new Date(end));
                        onNewFieldChange(new Date(end), 'endDate');
                      }
                    }}
                    format="dd/MM/yyyy - hh:mm"
                    time
                  ></CalenderLocal>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box style={{ marginTop: 5 }}>
                    <SelectLocal
                      options={eventLengthOptions}
                      value={eventLength}
                      onChange={(e: any) => {
                        const { value } = e.target;
                        setEventLength(value);
                        const end = startDate
                          ? new Date(startDate).getTime() + value * 60 * 1000
                          : null;
                        if (end) {
                          setEndDate(new Date(end));
                          onNewFieldChange(new Date(end), 'endDate');
                        }
                      }}
                      isRTL={isRTL}
                    ></SelectLocal>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <div style={{ pointerEvents: 'none', opacity: 0.5 }}>
                    <CalenderLocal
                      isRTL={isRTL}
                      label={words.end}
                      value={endDate}
                      onChange={(d: any) => setEndDate(d)}
                      format="dd/MM/yyyy - hh:mm"
                      time
                    ></CalenderLocal>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <AutoFieldLocal
                    name="retype"
                    title={words?.retype}
                    words={words}
                    options={retypes.filter((dep: any) => dep.reType === 4)}
                    value={rtypevalue}
                    setSelectValue={selectRetype}
                    isRTL={isRTL}
                    fullWidth
                    mb={0}
                  ></AutoFieldLocal>
                </Grid>
                {!tempoptions?.noTsk && (
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
                      multiline
                      rowsMax={3}
                      rows={3}
                      mb={0}
                    />
                  </Grid>
                )}
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isItems}
                        onChange={() => {
                          setIsItems(!isItems);
                          setItemsList([]);
                        }}
                        name="isItems"
                        color="primary"
                      />
                    }
                    style={{ marginTop: 25 }}
                    label={
                      <Typography style={{ fontWeight: 'bold', fontSize: 13 }}>
                        {isRTL ? 'اضافة بنود' : 'Add Items'}
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box
                    mt={1}
                    display="flex"
                    style={{
                      flex: 1,
                      marginTop: 25,
                      justifyContent: 'flex-start',
                      direction: 'ltr',
                    }}
                  >
                    <Button
                      size="medium"
                      color="primary"
                      variant="outlined"
                      onClick={() => setOpenMap(true)}
                    >
                      <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>
                        {isRTL ? 'الموقع الجغرافي' : 'Location'}
                      </Typography>
                    </Button>
                    {location?.lat && (
                      <>
                        <MyIcon
                          size={28}
                          color="#ff80ed"
                          icon="location"
                        ></MyIcon>
                        <Box
                          onClick={() => setLocation(null)}
                          style={{ cursor: 'pointer', padding: 2 }}
                        >
                          <MyIcon size={24} color="#aaa" icon="close"></MyIcon>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <AutoFieldLocal
                    name="status"
                    title={words.status}
                    words={words}
                    options={eventStatus}
                    value={status}
                    setSelectValue={setStatus}
                    onNewFieldChange={onNewFieldChange}
                    noPlus
                    isRTL={isRTL}
                    fullWidth
                  ></AutoFieldLocal>
                </Grid>

                {!tempoptions?.noTsk && (
                  <Grid item xs={12} style={{ marginTop: 5 }}>
                    <AutoFieldLocal
                      name="task"
                      title={tempwords?.task}
                      words={words}
                      options={tasks}
                      value={taskvalue}
                      setSelectValue={selectTask}
                      isRTL={isRTL}
                      fullWidth
                      mb={0}
                    ></AutoFieldLocal>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AutoFieldLocal
                    name="customer"
                    title={tempwords?.customer}
                    words={words}
                    options={customers}
                    value={custvalue}
                    setSelectValue={selectCustomer}
                    isRTL={isRTL}
                    openAdd={openCustomer}
                    fullWidth
                    showphone
                    mb={0}
                  ></AutoFieldLocal>
                </Grid>
                {!tempoptions?.noRes && (
                  <Grid item xs={12}>
                    <AutoFieldLocal
                      name="resourse"
                      title={tempwords?.resourse}
                      words={words}
                      options={resourses}
                      value={resovalue}
                      setSelectValue={selectResourse}
                      openAdd={openResourse}
                      isRTL={isRTL}
                      fullWidth
                      day={day}
                      mb={0}
                    ></AutoFieldLocal>
                  </Grid>
                )}
                {!tempoptions?.noEmp && (
                  <Grid item xs={12}>
                    <AutoFieldLocal
                      name="employee"
                      title={tempwords?.employee}
                      words={words}
                      options={employees}
                      disabled={isemployee}
                      value={emplvalue}
                      setSelectValue={selectEmployee}
                      openAdd={openEmployee}
                      isRTL={isRTL}
                      fullWidth
                      day={day}
                      mb={0}
                    ></AutoFieldLocal>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AutoFieldLocal
                    name="department"
                    title={tempwords?.department}
                    words={words}
                    options={departments.filter((d: any) => d.depType === 1)}
                    value={departvalue}
                    setSelectValue={selectDepartment}
                    openAdd={openDepartment}
                    isRTL={isRTL}
                    fullWidth
                    mb={0}
                  ></AutoFieldLocal>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {(isItems || itemsList?.length > 0) && (
            <Box
              style={{
                backgroundColor: '#f4f4f4',
                padding: 10,
                marginTop: 15,
                // marginBottom: 15,
                borderRadius: 10,
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
              <Box>
                <ItemsTable
                  products={[...services, ...products]}
                  rows={itemsList}
                  editItem={editItemInList}
                  removeItem={removeItemFromList}
                  isRTL={isRTL}
                  words={words}
                  user={user}
                ></ItemsTable>
              </Box>
            </Box>
          )}
          <Grid container spacing={1}>
            <Grid item xs={7}>
              {(isItems || itemsList?.length > 0) && (
                <Typography
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  {words.total} : {moneyFormat(totals.amount)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </Grid>
        <PopupCustomer
          newtext={newtext}
          open={openCust}
          onClose={onCloseCustomer}
          isNew={true}
          setNewValue={selectCustomer}
          row={null}
          addAction={addCustomer}
          editAction={editCustomer}
        ></PopupCustomer>
        <PopupDeprtment
          newtext={newtext}
          open={openDep}
          onClose={onCloseDepartment}
          isNew={true}
          setNewValue={selectDepartment}
          row={null}
          addAction={addDepartment}
          editAction={editDepartment}
        ></PopupDeprtment>
        <PopupEmployee
          newtext={newtext}
          open={openEmp}
          onClose={onCloseEmploee}
          isNew={true}
          setNewValue={selectEmployee}
          row={null}
          addAction={addEmployee}
          editAction={editEmployee}
        ></PopupEmployee>
        <PopupResourses
          newtext={newtext}
          open={openRes}
          onClose={onCloseResourse}
          isNew={true}
          setNewValue={selectResourse}
          row={null}
          addAction={addResourse}
          editAction={editResourse}
        ></PopupResourses>
        <PopupMaps
          open={openMap}
          onClose={() => setOpenMap(false)}
          isRTL={isRTL}
          theme={theme}
          location={location}
          setLocation={(value: any) => {
            setLocation(value);
            onNewFieldChange(value, 'location');
          }}
        ></PopupMaps>
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
          ></AlertLocal>
        )}
      </Grid>
    </Box>
  );
};
