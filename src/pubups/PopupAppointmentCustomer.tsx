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
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { eventStatus, weekdaysNNo } from '../constants/datatypes';
import ItemsTable from '../Shared/ItemsTable';
import { useLazyQuery } from '@apollo/client';
import { getOperationItems } from '../graphql';
import { invoiceClasses } from '../themes/classes';
import { moneyFormat } from '../Shared/colorFormat';
import PopupAddMultiEvents from './PopupAddMultiEvents';
import PopupAppointInvoice from './PopupAppointInvoice';
import { getPopupTitle } from '../constants/menu';
import { useCustomers, useProducts, useTemplate } from '../hooks';
import PopupCustomer from './PopupCustomer';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartments from '../hooks/useDepartments';
import useEmployees from '../hooks/useEmployees';
import useResourses from '../hooks/useResourses';
import PopupMaps from './PopupMaps';
import { SelectLocal } from '../pages/calendar/common/SelectLocal';
import { eventLengthOptions } from '../constants/rrule';
import { roles } from '../common';
import ServiceItemForm from '../Shared/ServiceItemForm';
import { successAlert } from '../Shared/helpers';
import useRetypes from '../hooks/useRetypes';
import MyIcon from '../Shared/MyIcon';

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
  tasks,
  name,
  value,
}: any) => {
  const classes = invoiceClasses();
  const [saving, setSaving] = useState(false);
  const [rtypevalue, setRtypevalue] = useState<any>(null);

  const [startDate, setStartDate]: any = useState(null);
  const [endDate, setEndDate]: any = useState(null);
  const [eventLength, setEventLength]: any = useState(null);
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

  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState(null);

  const [totals, setTotals] = useState<any>({});
  const [itemsList, setItemsList] = useState<any>([]);
  const [isItems, setIsItems] = useState(false);

  const [rrule, setRrule] = useState<any>(null);

  const [openMulti, setOpenMulti] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'contractId' ? value : null
  );

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [tasktitle, setTasktitle]: any = useState(null);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const { retypes } = useRetypes();
  const { addCustomer, editCustomer } = useCustomers();
  const { addDepartment, editDepartment } = useDepartments();
  const { addEmployee, editEmployee } = useEmployees();
  const { addResourse, editResourse } = useResourses();
  const { tempwords, tempoptions } = useTemplate();
  const { products } = useProducts();

  const { register, handleSubmit } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const isemployee = user?.isEmployee && user?.employeeId;

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
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
  }, [taskvalue]);

  useEffect(() => {
    if (row && row._id) {
      const items = itemsData?.data?.['getOperationItems']?.data || [];
      if (items && items.length > 0) {
        const ids = items.map((it: any) => it.itemId);
        const servlist = [...servicesproducts, ...products].filter((ser: any) =>
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
    if (isNew) {
      const start = new Date();
      const end = new Date();
      start.setMinutes(0);
      end.setHours(end.getHours() + 1);
      end.setMinutes(0);
      setStartDate(start);
      setEndDate(end);
      setStatus(eventStatus.filter((es: any) => es.id === 2)?.[0]);
    }
  }, [isNew, open]);

  useEffect(() => {
    getOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (isNew) {
      setEventLength(eventLengthOptions[1].value);
    }
  }, [isNew]);

  useEffect(() => {
    if (row && row._id) {
      getItems({ variables: { opId: row._id } });
      setTasktitle(row?.title);
      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;
      const custId = row.customerId;
      const contractId = row.contractId;
      const statNo = row.status;

      setStartDate(row?.startDate);
      setEndDate(row?.endDate);
      setRrule(row?.rRule);
      if (row?.retypeId) {
        const depart = retypes.filter(
          (dep: any) => dep._id === row.retypeId
        )[0];
        setRtypevalue(depart);
      }

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
      if (contractId) {
        const tsk = tasks.filter((ts: any) => ts._id === contractId)[0];
        setTaskvalue(tsk);
      }
      if (row.location) {
        setLocation({ lat: row?.location?.lat, lng: row?.location?.lng });
      }
    }
  }, [row]);

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
  };

  const resetAllForms = () => {
    setStartDate(null);
    setEndDate(null);
    setCustvalue(name === 'customerId' ? value : null);
    setDepartvalue(name === 'departmentId' ? value : null);
    setEmplvalue(name === 'employeeId' ? value : null);
    setResovalue(name === 'resourseId' ? value : null);
    setTaskvalue(name === 'contractId' ? value : null);
    setStatus(null);
    setRrule(null);
    setItemsList([]);
    setTotals({});
    setSaving(false);
    setTasktitle(null);
    setLocation(null);
    setEventLength(null);
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

    setSaving(true);
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
      location: location?.lat ? location : null,
      amount: totals.amount,
      status: status ? status.id : 2,
      items: JSON.stringify(itemsList),
      rRule,
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
      contract: taskvalue
        ? {
            contractId: taskvalue._id,
            contractName: taskvalue.name,
            contractNameAr: taskvalue.nameAr,
          }
        : {
            contractId: undefined,
            contractName: undefined,
            contractNameAr: undefined,
          },
      project: taskvalue
        ? {
            projectId: taskvalue.projectId,
            projectName: taskvalue.projectName,
            projectNameAr: taskvalue.projectNameAr,
          }
        : {
            projectId: undefined,
            projectName: undefined,
            projectNameAr: undefined,
          },
      retype: rtypevalue
        ? {
            retypeId: rtypevalue._id,
            retypeName: rtypevalue.name,
            retypeNameAr: rtypevalue.nameAr,
            retypeColor: rtypevalue.color,
          }
        : {
            retypeId: undefined,
            retypeName: undefined,
            retypeNameAr: undefined,
            retypeColor: undefined,
          },
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

  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];
  const title = getPopupTitle('appointment', isNew);

  const desabledSave = row.status === 10 || !roles.isEditor();

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
      mt={10}
      maxWidth="md"
      mb={20}
    >
      <>
        <Box display="flex">
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
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
                        const end = eventLength
                          ? new Date(d).getTime() + eventLength * 60 * 1000
                          : null;
                        if (end) {
                          setEndDate(new Date(end));
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
                      setSelectValue={setRtypevalue}
                      register={register}
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
                        onChange={(e: any) => setTasktitle(e.target.value)}
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
                        <Typography
                          style={{ fontWeight: 'bold', fontSize: 13 }}
                        >
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
                        <Typography
                          style={{ fontSize: 13, fontWeight: 'bold' }}
                        >
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
                            <MyIcon
                              size={24}
                              color="#aaa"
                              icon="close"
                            ></MyIcon>
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
                        fullWidth
                      ></AutoFieldLocal>
                    </Box>
                  </Grid>
                  {!tempoptions?.noTsk && (
                    <Grid item xs={12}>
                      <AutoFieldLocal
                        name="task"
                        title={tempwords?.task}
                        words={words}
                        options={tasks}
                        value={taskvalue}
                        setSelectValue={setTaskvalue}
                        register={register}
                        isRTL={isRTL}
                        fullWidth
                        disabled={name === 'contractId'}
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
                      mb={0}
                    ></AutoFieldLocal>
                  </Grid>
                  {!tempoptions?.noRes && (
                    <Grid item xs={12}>
                      <AutoFieldLocal
                        name="resourse"
                        title={tempwords?.resourse}
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
            </Grid>
          </Grid>
          {(isItems || itemsList?.length > 0) && (
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
                  services={servicesproducts}
                  products={products}
                  addItem={addItemToList}
                  words={words}
                  classes={classes}
                  user={user}
                  isRTL={isRTL}
                  setAlrt={() => null}
                ></ServiceItemForm>
              </Box>
              <Box style={{ marginBottom: 20 }}>
                <ItemsTable
                  products={[...servicesproducts, ...products]}
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
          <Grid container spacing={2}>
            <Grid item xs={7}>
              {(isItems || itemsList?.length > 0) && (
                <Typography
                  style={{ fontWeight: 'bold', fontSize: 16, padding: 10 }}
                >
                  {words.total} : {moneyFormat(totals.amount)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={2}>
              {!isNew && itemsList?.length > 0 && (
                <Box
                  m={1}
                  display="flex"
                  style={{ flex: 1, justifyContent: 'flex-end', marginTop: 5 }}
                >
                  <Button
                    size="medium"
                    color="primary"
                    variant="outlined"
                    onClick={() => setOpenInvoice(true)}
                    disabled={desabledSave}
                  >
                    <Typography>{words.addInvoice}</Typography>
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
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
          services={[...servicesproducts, ...products]}
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
        <PopupMaps
          open={openMap}
          onClose={() => setOpenMap(false)}
          isRTL={isRTL}
          theme={theme}
          location={location}
          setLocation={setLocation}
        ></PopupMaps>
      </>
    </PopupLayout>
  );
};

export default PopupAppointmentCustomer;
