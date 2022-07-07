/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { invoiceClasses } from '../themes';
import { useProducts, useTemplate } from '../hooks';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';

import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import ServiceItemForm from '../Shared/ServiceItemForm';
import ItemsTable from '../Shared/ItemsTable';
import { PriceTotal } from '../Shared/TotalPrice';
import { operationTypes } from '../constants';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createInvoice,
  getDepartments,
  getEmployees,
  getInvoices,
  getOperationItems,
  getProjects,
  getResourses,
} from '../graphql';
import { accountCode } from '../constants/kaid';
import PaymentSelect from '../pages/options/PaymentSelect';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal } from '../components';
import { getAppStartEndPeriod } from '../common/time';
import { useReactToPrint } from 'react-to-print';
import { InvoicePrint } from '../print';
import { getInvDays } from '../common/helpers';
import getGereralCalculation from '../graphql/query/getGereralCalculation';
import { getCustomers, getTasks } from '../graphql/query';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupTaskInvoice = ({
  open,
  onClose,
  task,
  customers,
  services,
  resourses,
  employees,
  departments,
  company,
  isNew = true,
  theme,
  mstart,
  mend,
}: any) => {
  const classes = invoiceClasses();
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [invNo, setInvNo] = useState<any>('');

  const [isPeriod, setIsPeriod] = useState(false);
  const [periodfrom, setPeriodfrom] = useState(null);
  const [periodto, setPeriodto] = useState(null);
  const [invdays, setInvdays] = useState(0);

  const [itemsList, setItemsList] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [ptype, setPtype] = useState<any>('cash');

  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState<any>({});

  const [custvalue, setCustvalue] = useState<any>(null);
  const [custError, setCustError] = useState<any>(false);
  const custRef: any = useRef();

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = useRef();

  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = useRef();

  const [resovalue, setResovalue] = useState<any>(null);
  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = useRef();

  const [isCash, setIsCash] = useState(true);
  const { tempwords, tempoptions } = useTemplate();

  const { products } = useProducts();

  const { handleSubmit, reset } = useForm({});
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const refresQuery = {
    refetchQueries: [
      { query: getInvoices, variables: { contractId: task._id } },
      {
        query: getGereralCalculation,
        variables: {
          contractId: task._id,
          start: mstart ? new Date(mstart).setHours(0, 0, 0, 0) : undefined,
          end: mend ? new Date(mend).setHours(23, 59, 59, 999) : undefined,
        },
      },
      { query: getDepartments, variables: { isRTL, depType: 1 } },
      { query: getEmployees, variables: { isRTL, resType: 1 } },
      { query: getResourses, variables: { isRTL, resType: 1 } },
      { query: getProjects },
      { query: getTasks },
      { query: getCustomers },
    ],
  };
  const [getItems, itemsData]: any = useLazyQuery(getOperationItems);

  const [addInvoice] = useMutation(createInvoice, refresQuery);

  const resetAllForms = () => {
    setItemsList([]);
    setDiscount(0);
    setTotals({});
    setCustvalue(null);
    setInvNo('');
    setAccounts([]);
    setPtype('cash');
    setSaving(false);
    setSelectedDate(new Date());
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
    setIsPeriod(false);
    setPeriodfrom(null);
    setPeriodto(null);
    setInvdays(0);
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
    if (isPeriod === true) {
      if (!periodfrom) {
        setPeriodfrom(task?.periodfrom ? task?.periodfrom : task.start);
      }
      if (!periodto) {
        setPeriodto(new Date());
      }
      if (invdays) {
        const litems = itemsList.map((it: any) => {
          return { ...it, itemqty: invdays, itemtotal: invdays * it.itemprice };
        });
        setItemsList(litems);
      }
    } else {
      setPeriodfrom(null);
      setPeriodto(null);
      setInvdays(0);
    }
  }, [isPeriod, invdays]);

  useEffect(() => {
    if (periodfrom && periodto) {
      const days = getInvDays(periodfrom, periodto);
      setInvdays(days);
    }
  }, [periodfrom, periodto]);

  useEffect(() => {
    getOverallTotal();
  }, [itemsList, discount, ptype, isCash]);

  useEffect(() => {
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
        };
      });
      itemsWqtyprice.sort((a: any, b: any) =>
        a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
      );
      setItemsList(itemsWqtyprice);
    }
  }, [itemsData]);

  useEffect(() => {
    if (task && task.start) {
      getItems({ variables: { opId: task._id } });

      const _id = task.customerId;
      const cust = customers.filter((it: any) => it._id === _id)[0];
      setCustvalue(cust);
      const depId = task.departmentId;
      const empId = task.employeeId;
      const resId = task.resourseId;
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
    }
  }, [task, services, customers, open]);

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
      setCustError(true);
      custRef.current.focus();
      return;
    }
    if (!itemsList || itemsList.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `يجب اضافة عنصر واحد للفاتورة على الأقل`
          : `You should add min one service to invoice`
      );
      return;
    }
    if (isPeriod && Number(invdays) < 0) {
      await messageAlert(
        setAlrt,
        isRTL ? `الفترة الزمنية غير صحيحة` : `Incorrect Time`
      );
      return;
    }
    setSaving(true);
    const { amount, costAmount, profit, total } = totals;

    const variables: any = {
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
      contract: {
        contractId: task._id,
        contractName: task.name,
        contractNameAr: task.nameAr,
      },
      project: task
        ? {
            projectId: task.projectId,
            projectName: task.projectName,
            projectNameAr: task.projectNameAr,
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
      periodfrom,
      periodto,
      userId: user._id,
    };
    apply(addInvoice, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
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
  };

  const title = isRTL
    ? isNew
      ? 'فاتورة جديدة'
      : 'تعديل فاتورة'
    : isNew
    ? 'New Invoice'
    : 'Edit Invoice';

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
      print={handleReactPrint}
      maxWidth="md"
      mt={0}
      mb={50}
      // bgcolor={colors.green[500]}
    >
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.time}
                value={selectedDate}
                onChange={handleDateChange}
              ></CalenderLocal>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                style={{ marginTop: 25, marginLeft: 10, marginRight: 10 }}
                control={
                  <Checkbox
                    checked={isPeriod}
                    onChange={() => setIsPeriod(!isPeriod)}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    style={{ color: theme.palette.primary.main }}
                    variant="body2"
                  >
                    {isRTL ? 'فاتورة وقت' : 'Time Invoice'}
                  </Typography>
                }
              />
            </Grid>
            {isPeriod && (
              <Grid item xs={5}>
                <CalenderLocal
                  isRTL={isRTL}
                  label={words.start}
                  value={periodfrom}
                  onChange={setPeriodfrom}
                ></CalenderLocal>
              </Grid>
            )}
            {isPeriod && (
              <Grid item xs={5}>
                <CalenderLocal
                  isRTL={isRTL}
                  label={words.end}
                  value={periodto}
                  onChange={setPeriodto}
                ></CalenderLocal>
              </Grid>
            )}
            {isPeriod && (
              <Grid item xs={2}>
                <Typography
                  style={{ marginTop: 35, marginLeft: 10, marginRight: 10 }}
                >{`( ${invdays} )`}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <PaymentSelect
            words={words}
            ptype={ptype}
            isCash={isCash}
            setIsCash={setIsCash}
            setPtype={setPtype}
          ></PaymentSelect>
        </Grid>
        <Grid item xs={7}>
          <AutoFieldLocal
            name="customer"
            title={words.customer}
            words={words}
            options={customers}
            value={custvalue}
            setSelectValue={setCustvalue}
            setSelectError={setCustError}
            selectError={custError}
            isRTL={isRTL}
            fullWidth
            disabled
            // openAdd={openCustomer}
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={2}>
          {!isNew && (
            <Box
              display="flex"
              style={{
                flex: 1,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginLeft: isRTL ? undefined : 20,
                marginRight: isRTL ? 20 : undefined,
              }}
            >
              <TextField
                name="invNo"
                disabled
                value={invNo}
                variant="outlined"
                style={{ width: isNew ? 70 : 100, marginLeft: 20 }}
                margin="dense"
                // type="number"
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
              disabled
            ></AutoFieldLocal>
          </Grid>
        )}
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
              disabled
            ></AutoFieldLocal>
          </Grid>
        )}
        <Grid item xs={4}>
          <AutoFieldLocal
            name="department"
            title={words.department}
            words={words}
            options={departments}
            value={departvalue}
            setSelectValue={setDepartvalue}
            setSelectError={setDepartError}
            selectError={departError}
            refernce={departRef}
            noPlus
            isRTL={isRTL}
            fullWidth
            disabled
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
          </Box>
          <Box
            display="flex"
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
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

export default PopupTaskInvoice;
