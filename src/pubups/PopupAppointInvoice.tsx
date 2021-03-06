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
import ItemsTable from '../Shared/ItemsTable';
import { PriceTotal } from '../Shared/TotalPrice';
import { operationTypes } from '../constants';
import { useMutation } from '@apollo/client';
import { createInvoice, getInvoices, getProducts } from '../graphql';
import { accountCode, parents } from '../constants/kaid';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal } from '../components';
import PopupCustomer from './PopupCustomer';
import { weekdaysNNo } from '../constants/datatypes';
import useTasks from '../hooks/useTasks';
import { useReactToPrint } from 'react-to-print';
import useCompany from '../hooks/useCompany';
import useEmployees from '../hooks/useEmployees';
import useDepartments from '../hooks/useDepartments';
import useResourses from '../hooks/useResourses';
import { InvoicePrint } from '../print';
import ServiceItemForm from '../Shared/ServiceItemForm';
import { sleep, successAlert } from '../Shared/helpers';
import useAccounts from '../hooks/useAccounts';
import PaymentSelect from '../pages/options/PaymentSelect';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupAppointInvoice = ({
  open,
  onClose,
  appoint,
  services,
  editEvent,
  isNew = true,
  theme,
  items,
  onCloseAppoint = () => null,
}: any) => {
  const classes = invoiceClasses();
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [invNo, setInvNo] = useState<any>('');

  const [itemsList, setItemsList] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);

  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState<any>({});

  const [custvalue, setCustvalue] = useState<any>(null);

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

  const [isCash, setIsCash] = useState(false);
  const [paid, setPaid] = useState<any>(0);
  const [debitAcc, setDebitAcc]: any = React.useState(null);

  const [openCust, setOpenCust] = useState(false);
  const [newtext, setNewtext] = useState('');

  const { customers, addCustomer, editCustomer } = useCustomers();
  const { accounts: mainAccounts } = useAccounts();

  const { tasks } = useTasks();
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { resourses } = useResourses();
  const { company } = useCompany();
  const { tempoptions, tempwords } = useTemplate();
  const { products } = useProducts();
  const { handleSubmit, reset } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const refresQuery = {
    refetchQueries: [
      {
        query: getInvoices,
        variables: {
          start: new Date().setHours(0, 0, 0, 0),
          end: new Date().setHours(23, 59, 59, 999),
        },
      },
      { query: getProducts },
    ],
  };

  const [addInvoice] = useMutation(createInvoice, refresQuery);

  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext('');
  };
  const onNewFieldChange = (nextValue: any) => {
    setCustvalue(nextValue);
  };

  const cashaccounts = mainAccounts.filter(
    (acc: any) => acc.parentcode === parents.CASH && acc.code < 10499
  );
  useEffect(() => {
    if (isCash) {
      setDebitAcc(cashaccounts?.[0]);
    }
  }, [open, isCash]);

  const resetAllForms = () => {
    reset();
    setItemsList([]);
    setDiscount(0);
    setTotals({});
    setCustvalue(null);
    setInvNo('');
    setAccounts([]);
    setIsCash(false);
    setSaving(false);
    setSelectedDate(new Date());
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
    setPaid(0);
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
    if (date) {
      const d = new Date(date);
      d?.setHours(8, 0, 0);
      setSelectedDate(d);
    }
  };
  useEffect(() => {
    getOverallTotal();
  }, [itemsList, discount, isCash, paid, debitAcc]);

  useEffect(() => {
    if (appoint && appoint.startDate) {
      const _id = appoint.customerId;
      const cust = customers.filter((it: any) => it._id === _id)[0];
      setCustvalue(cust);
    }
    const depId = appoint.departmentId;
    const empId = appoint.employeeId;
    const resId = appoint.resourseId;
    const da = appoint.debitAcc;

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
    if (appoint.contractId) {
      const empl = tasks.filter(
        (emp: any) => emp._id === appoint.contractId
      )[0];
      setTaskvalue(empl);
    }
    if (items) {
      setItemsList(items);
    }
    if (da) {
      const debit = mainAccounts.filter((acc: any) => acc.code === da)[0];
      setDebitAcc(debit);
    }
    setIsCash(appoint.isCash);
    setDiscount(appoint.discount);
    setInvNo(appoint.docNo);
  }, [appoint, services, customers, items]);

  useEffect(() => {
    if (isNew) {
      const start = new Date();
      start.setHours(8, 0, 0);
      setSelectedDate(start);
    }
  }, [open]);

  const getOverallTotal = () => {
    const totalsin = itemsList.map((litem: any) => litem.itemtotal);
    const sum = totalsin.reduce((psum: any, a: any) => psum + a, 0);

    const costtotals = itemsList.map(
      (litem: any) => litem.cost * litem.itemqty
    );
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
        debitAcc: debitAcc?.code,
        creditAcc: accountCode.accounts_receivable,
        amount: isCash ? paid : 0,
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
    if (selectedDate > new Date()) {
      await messageAlert(
        setAlrt,
        isRTL ? '?????? ?????????? ??????????????' : 'Date should be change'
      );
      return;
    }
    if (discount < 0) {
      await messageAlert(
        setAlrt,
        isRTL ? '?????????? ???? ???????? ???? ???????? ????????' : "Discount can't be minus"
      );
      return;
    }
    if (discount > totals?.total) {
      await messageAlert(
        setAlrt,
        isRTL
          ? '?????????? ???? ???????? ???? ???????? ???????? ???? ???????? ????????????????'
          : "Discount can't be biger than Total"
      );
      return;
    }
    if (!custvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? '???????? ?????????? ???????? ????????????????' : 'Please add Customer'
      );
      return;
    }
    if (!itemsList || itemsList.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `?????? ?????????? ???????? (???????? ???? ????????) ???????? ???????????????? ?????? ??????????`
          : `You should add min one service to invoice`
      );
      return;
    }
    setSaving(true);

    const { amount, costAmount, profit, total } = totals;

    const variables: any = {
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
      amountPaid: isCash ? paid : 0,
      accounts,
      userId: user._id,
      eventId: appoint.id,
      eventNo: appoint.docNo,
    };
    apply(addInvoice, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      await sleep(2);
      editEvent({
        variables: {
          id: appoint.id,
          status: 10,
        },
      });
      await successAlert(setAlrt, isRTL);
      setSaving(false);
      onCloseForm();
      onCloseAppoint();
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
      reset();
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

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice #${invNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    invoiceNo: invNo,
    time: selectedDate,
    customerName: custvalue?.name,
    customerPhone: custvalue?.phone,
    total: totals.total,
    amount: totals.amount,
    items: itemsList,
    discount,
  };

  const date = appoint?.startDate ? new Date(appoint?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = isRTL ? '???????????? ??????' : 'Sales Invoice';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      print={handleReactPrint}
      saving={saving}
      maxWidth="md"
      mt={0}
      mb={50}
      saveprint
      // bgcolor={colors.green[500]}
    >
      <Grid container spacing={1}>
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
          {isNew && (
            <PaymentSelect
              words={words}
              isCash={isCash}
              setIsCash={setIsCash}
              paid={paid}
              setPaid={setPaid}
              isRTL={isRTL}
              debitaccounts={cashaccounts}
              debitAcc={debitAcc}
              setDebitAcc={setDebitAcc}
            ></PaymentSelect>
          )}
        </Grid>
        <Grid item xs={8}>
          <AutoFieldLocal
            name="customer"
            title={words.customer}
            words={words}
            options={customers}
            value={custvalue}
            setSelectValue={setCustvalue}
            isRTL={isRTL}
            fullWidth
            openAdd={openCustomer}
            showphone
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={4}></Grid>
        {!tempoptions?.noTsk && (
          <Grid item xs={4}>
            <AutoFieldLocal
              name="task"
              title={words.task}
              words={words}
              options={tasks}
              value={taskvalue}
              setSelectValue={setTaskvalue}
              isRTL={isRTL}
              fullWidth
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
              setSelectValue={setResovalue}
              setSelectError={setResoError}
              selectError={resoError}
              refernce={resoRef}
              noPlus
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
              setSelectValue={setEmplvalue}
              setSelectError={setEmplError}
              selectError={emplError}
              refernce={emplRef}
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
            title={words.department}
            words={words}
            options={departments.filter((d: any) => d.depType === 1)}
            value={departvalue}
            setSelectValue={setDepartvalue}
            setSelectError={setDepartError}
            selectError={departError}
            refernce={departRef}
            noPlus
            isRTL={isRTL}
            fullWidth
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: '#f4f4f4',
              padding: 10,
              marginTop: 15,
              marginBottom: 15,
              borderRadius: 10,
            }}
          >
            <Box display="flex" style={{ paddingLeft: 10, paddingRight: 10 }}>
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
            {(isNew || itemsList.length > 0) && (
              <Box style={{ marginBottom: 20 }}>
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
            )}
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
              value={discount?.toString()}
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
            setNewValue={onNewFieldChange}
            row={null}
            addAction={addCustomer}
            editAction={editCustomer}
          ></PopupCustomer>

          <Box>
            <div style={{ display: 'none' }}>
              <InvoicePrint
                company={company}
                user={user}
                printData={printData}
                ref={componentRef}
              />
            </div>
          </Box>
        </Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAppointInvoice;
