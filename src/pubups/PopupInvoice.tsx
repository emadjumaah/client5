/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { invoiceClasses } from '../themes';
import { useCustomers, useProducts, useTemplate } from '../hooks';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, TextField, Typography } from '@material-ui/core';
import ServiceItemForm from '../Shared/ServiceItemForm';
import ItemsTable from '../Shared/ItemsTable';
import { PriceTotal } from '../Shared/TotalPrice';
import { operationTypes } from '../constants';
import { accountCode } from '../constants/kaid';
import PaymentSelect from '../pages/options/PaymentSelect';
import PopupCustomer from './PopupCustomer';
import { useLazyQuery } from '@apollo/client';
import { getOperationItems } from '../graphql';
import LoadingInline from '../Shared/LoadingInline';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { getAppStartEndPeriod } from '../common/time';
import { CalenderLocal } from '../components';
import { useReactToPrint } from 'react-to-print';
import { weekdaysNNo } from '../constants/datatypes';
import useTasks from '../hooks/useTasks';
import useCompany from '../hooks/useCompany';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartments from '../hooks/useDepartments';
import useEmployees from '../hooks/useEmployees';
import useResourses from '../hooks/useResourses';
import { InvoicePrint } from '../print';
import { sleep, successAlert } from '../Shared/helpers';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupInvoice = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  resourses,
  employees,
  departments,
  servicesproducts,
  theme,
  task,
  value,
  name,
}: any) => {
  const classes = invoiceClasses();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { tasks } = useTasks();
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [invNo, setInvNo] = useState<any>('');

  const [itemsList, setItemsList] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [ptype, setPtype] = useState<any>('cash');

  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState<any>({});

  const { company } = useCompany();

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
  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'contractId' ? value : null
  );

  const [isCash, setIsCash] = useState(true);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const { customers, addCustomer, editCustomer } = useCustomers();
  const { addDepartment, editDepartment } = useDepartments();
  const { addEmployee, editEmployee } = useEmployees();
  const { addResourse, editResourse } = useResourses();
  const { tempwords, tempoptions } = useTemplate();
  const { products } = useProducts();

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
    if (isNew && !isemployee) {
      if (taskvalue) {
        if (taskvalue?.departmentId && name !== 'departmentId') {
          const dept = departments.filter(
            (dep: any) => dep._id === taskvalue?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
        if (taskvalue?.employeeId && name !== 'employeeId') {
          const emp = employees.filter(
            (dep: any) => dep._id === taskvalue?.employeeId
          )?.[0];
          setEmplvalue(emp);
        }
        if (taskvalue?.resourseId && name !== 'resourseId') {
          const res = resourses.filter(
            (dep: any) => dep._id === taskvalue?.resourseId
          )?.[0];
          setResovalue(res);
        }
        if (taskvalue?.customerId && name !== 'customerId') {
          const cust = customers.filter(
            (dep: any) => dep._id === taskvalue?.customerId
          )?.[0];
          setCustvalue(cust);
        }
      }
    }
  }, [taskvalue]);

  useEffect(() => {
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
          itemtotalcost: item.totalCost,
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
  const { handleSubmit, reset } = useForm({});

  const resetAllForms = () => {
    reset();
    setItemsList([]);
    setDiscount(0);
    setTotals({});
    setInvNo('');
    setAccounts([]);
    setPtype('cash');
    setIsCash(false);
    setSelectedDate(new Date());
    setCustvalue(name === 'customerId' ? value : null);
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

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (isNew) {
      if (name === 'contractId') {
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
    }
  }, [open]);

  useEffect(() => {
    getOverallTotal();
  }, [itemsList, discount, ptype, isCash]);

  useEffect(() => {
    if (row && row._id) {
      setLoading(true);
      const variables = { opId: row._id };
      getItems({
        variables,
      });
      const _id = row.customerId;
      const cust = customers.filter((it: any) => it._id === _id)[0];

      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;
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

      if (!task && row.contractId) {
        const tsk = tasks.filter((ts: any) => ts._id === row.contractId)[0];
        setTaskvalue(tsk);
      }
      setCustvalue(cust);
      setIsCash(row.isCash);
      setDiscount(row.discount);
      setInvNo(row.docNo);
      handleDateChange(row.time);
      setPtype(row.paymentType ? row.paymentType : '');
    }
  }, [row]);

  const getOverallTotal = () => {
    const totalsin = itemsList.map((litem: any) => litem.itemtotal);
    const sum = totalsin.reduce((psum: any, a: any) => psum + a, 0);
    const costtotals = itemsList.map((litem: any) => litem.itemtotalcost);
    const costsum = costtotals.reduce((psum: any, a: any) => psum + a, 0);
    const amount = sum - discount;
    const profit = sum - discount - costsum;
    const tots = {
      itemsSum: amount,
      itemsCostSum: costsum,
      costAmount: costsum,
      total: sum,
      amount,
      profit,
    };
    setTotals(tots);
    const accs = [
      {
        debitAcc: accountCode.accounts_receivable,
        creditAcc: accountCode.sales_income,
        amount: sum,
        type: operationTypes.salesInvoice,
      },
      {
        debitAcc: accountCode.sales_income,
        creditAcc: accountCode.accounts_receivable,
        amount: discount,
        type: operationTypes.customerDiscount,
      },
      {
        debitAcc:
          ptype === 'cash' ? accountCode.cash_on_hand : accountCode.card,
        creditAcc: accountCode.accounts_receivable,
        amount: isCash ? sum - discount : 0,
        type: operationTypes.customerReceipt,
      },
      {
        debitAcc: accountCode.cost_of_sales,
        creditAcc: accountCode.inventory,
        amount: costsum,
        type: operationTypes.salesDelivery,
      },
    ];

    setAccounts(accs);
  };
  const onSubmit = async () => {
    const { startPeriod, endPeriod } = getAppStartEndPeriod();
    if (selectedDate < startPeriod || selectedDate > endPeriod) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }
    if (selectedDate > new Date()) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }
    if (discount < 0) {
      await messageAlert(
        setAlrt,
        isRTL ? 'الحسم لا يمكن ان يكون سلبي' : "Discount can't be minus"
      );
      return;
    }
    if (discount > totals?.total) {
      await messageAlert(
        setAlrt,
        isRTL
          ? 'الحسم لا يمكن ان يكون اكبر من قيمة الفاتورة'
          : "Discount can't be biger than Total"
      );
      return;
    }
    if (!custvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يرجى اضافة عميل للفاتورة' : 'Please add Customer'
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
    const { amount, costAmount, profit, total } = totals;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      docNo: invNo ? invNo.toString() : undefined,
      time: selectedDate,
      customer: {
        customerId: custvalue._id,
        customerName: custvalue.name,
        customerNameAr: custvalue.nameAr,
        customerPhone: custvalue.phone,
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
      items: JSON.stringify(itemsList),
      costAmount,
      total,
      discount,
      amount,
      profit,
      isPaid: isCash,
      isCash,
      amountPaid: isCash ? amount : 0,
      accounts,
      paymentType: ptype,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;

    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      await sleep(2);
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
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice #${row?.docNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    invoiceNo: row?.docNo,
    time: selectedDate,
    customerName: custvalue?.name,
    customerPhone: custvalue?.phone,
    total: totals.total,
    amount: totals.amount,
    items: itemsList,
  };
  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];
  const title = isRTL ? 'فاتورة بيع' : 'Sales Invoice';
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      print={!isNew ? handleReactPrint : undefined}
      maxWidth="md"
      saving={saving}
      mt={0}
      mb={40}
      // bgcolor={colors.green[500]}
    >
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <CalenderLocal
            isRTL={isRTL}
            label={words.time}
            value={selectedDate}
            onChange={handleDateChange}
          ></CalenderLocal>
          {!isNew && (
            <Box
              display="flex"
              style={{
                flex: 1,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {isNew && (
                <Typography style={{ color: '#777' }}>{words.no}</Typography>
              )}
              <TextField
                name="invNo"
                disabled
                value={invNo}
                variant="outlined"
                style={{ width: isNew ? 70 : 100, marginLeft: 20 }}
                margin="dense"
                inputProps={{
                  style: {
                    textAlign: 'center',
                    fontSize: 14,
                    height: 13,
                  },
                }}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={8}>
          <PaymentSelect
            words={words}
            ptype={ptype}
            isCash={isCash}
            setIsCash={setIsCash}
            setPtype={setPtype}
          ></PaymentSelect>
        </Grid>

        <Grid item xs={8}>
          <AutoFieldLocal
            name="customer"
            title={tempwords?.customer}
            words={words}
            options={customers}
            value={custvalue}
            setSelectValue={setCustvalue}
            isRTL={isRTL}
            fullWidth
            openAdd={openCustomer}
            showphone
            disabled={name === 'customerId'}
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={4}></Grid>
        {!tempoptions?.noTsk && (
          <Grid item xs={4}>
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
        {!tempoptions?.noRes && (
          <Grid item xs={4}>
            <AutoFieldLocal
              name="resourse"
              title={tempwords?.resourse}
              words={words}
              options={resourses}
              value={resovalue}
              disabled={name === 'resourseId'}
              setSelectValue={setResovalue}
              setSelectError={setResoError}
              selectError={resoError}
              refernce={resoRef}
              openAdd={openResourse}
              isRTL={isRTL}
              fullWidth
              day={day}
            ></AutoFieldLocal>
          </Grid>
        )}
        {!tempoptions?.noRes && <Grid item xs={4}></Grid>}
        {!tempoptions?.noEmp && (
          <Grid item xs={4}>
            <AutoFieldLocal
              name="employee"
              title={tempwords?.employee}
              words={words}
              options={employees}
              value={emplvalue}
              disabled={isemployee || name === 'employeeId'}
              setSelectValue={setEmplvalue}
              setSelectError={setEmplError}
              selectError={emplError}
              refernce={emplRef}
              openAdd={openEmployee}
              isRTL={isRTL}
              fullWidth
              day={day}
            ></AutoFieldLocal>
          </Grid>
        )}
        <Grid item xs={4}>
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
            openAdd={openDepartment}
            isRTL={isRTL}
            fullWidth
            disabled={name === 'departmentId'}
          ></AutoFieldLocal>
        </Grid>

        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: '#f3f3f3',
              padding: 10,
              marginTop: 15,
              marginBottom: 15,
              borderRadius: 10,
            }}
          >
            <Box display="flex" style={{ paddingLeft: 10, paddingRight: 10 }}>
              <ServiceItemForm
                services={servicesproducts}
                products={products}
                addItem={addItemToList}
                words={words}
                classes={classes}
                user={user}
                isRTL={isRTL}
                setAlrt={setAlrt}
              ></ServiceItemForm>
            </Box>
            {(isNew || itemsList.length > 0) && (
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
            )}
            {loading && <LoadingInline></LoadingInline>}
          </Box>
          <Box
            display="flex"
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: 10,
              marginLeft: 10,
            }}
          >
            <TextField
              name="discount"
              label={words.discount}
              value={discount.toString()}
              onChange={(e: any) => setDiscount(Number(e.target.value))}
              variant="outlined"
              style={{ width: 200 }}
              margin="dense"
              type="number"
              onFocus={(e) => e.target.select()}
            />

            <PriceTotal
              amount={totals?.amount}
              total={totals?.total}
              discount={discount}
              words={words}
            ></PriceTotal>
          </Box>
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
          <Box>
            <div style={{ display: 'none' }}>
              <InvoicePrint
                company={company}
                user={user}
                printData={printData}
                ref={componentRef}
              />
              {/* <PosPrint
                company={company}
                user={user}
                printData={printData}
                ref={componentRef}
              /> */}
            </div>
          </Box>
        </Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupInvoice;
