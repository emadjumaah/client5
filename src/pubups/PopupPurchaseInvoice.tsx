/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { invoiceClasses } from '../themes';
import { useLastNos, useSuppliers, useTemplate } from '../hooks';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, TextField, Typography } from '@material-ui/core';
import ItemsTable from '../Shared/ItemsTable';
import { PriceTotal } from '../Shared/TotalPrice';
import { operationTypes } from '../constants';
import { accountCode } from '../constants/kaid';
import PaymentSelect from '../pages/options/PaymentSelect';
import { useLazyQuery } from '@apollo/client';
import { getOperationItems } from '../graphql';
import LoadingInline from '../Shared/LoadingInline';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { getAppStartEndPeriod } from '../common/time';
import { CalenderLocal } from '../components';
import PopupSupplier from './PopupSupplier';
import _ from 'lodash';
import useTasks from '../hooks/useTasks';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import { weekdaysNNo } from '../constants/datatypes';
import { InvoicePrint } from '../print';
import { useReactToPrint } from 'react-to-print';
import useCompany from '../hooks/useCompany';
import ProductItemForm from '../Shared/ProductItemForm';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupPurchaseInvoice = ({
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

  const [isCash, setIsCash] = useState(true);

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

  const [suppvalue, setSuppvalue] = useState<any>(
    name === 'supplierId' ? value : null
  );

  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'contractId' ? value : null
  );

  const [newtext, setNewtext] = useState('');

  const [openSupp, setOpenSupp] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const { lastNos, freshlastNos } = useLastNos();

  const { suppliers, addSupplier, editSupplier } = useSuppliers();
  const { addDepartment, editDepartment } = useDepartmentsUp();
  const { addEmployee, editEmployee } = useEmployeesUp();
  const { addResourse, editResourse } = useResoursesUp();
  const { tempwords, tempoptions } = useTemplate();

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

  const openSupplier = () => {
    setOpenSupp(true);
  };
  const onCloseSupplier = () => {
    setOpenSupp(false);
    setNewtext('');
  };
  const onNewSuppChange = (nextValue: any) => {
    setSuppvalue(nextValue);
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
        if (taskvalue?.supplierId && name !== 'supplierId') {
          const cust = suppliers.filter(
            (dep: any) => dep._id === taskvalue?.supplierId
          )?.[0];
          setSuppvalue(cust);
        }
      }
    }
  }, [taskvalue]);

  // useEffect(() => {
  //   if (isNew) {
  //     if (emplvalue) {
  //       if (emplvalue?.departmentId) {
  //         const dept = departments.filter(
  //           (dep: any) => dep._id === emplvalue?.departmentId
  //         )?.[0];
  //         setDepartvalue(dept);
  //       }
  //     }
  //   }
  // }, [emplvalue]);

  // useEffect(() => {
  //   if (isNew) {
  //     if (resovalue) {
  //       if (resovalue?.departmentId) {
  //         const dept = departments.filter(
  //           (dep: any) => dep._id === resovalue?.departmentId
  //         )?.[0];
  //         setDepartvalue(dept);
  //       }
  //     }
  //   }
  // }, [resovalue]);

  useEffect(() => {
    const items = itemsData?.data?.['getOperationItems']?.data || [];

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
          itemtotalcost: item.qty * serv.cost,
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
    setSuppvalue(null);
    reset();
    setItemsList([]);
    setDiscount(0);
    setTotals({});
    setInvNo('');
    setAccounts([]);
    setPtype('cash');
    setTaskvalue(null);
    setIsCash(false);
    setSelectedDate(new Date());
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
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
    if (isNew && lastNos) {
      setInvNo(
        lastNos?.purchaseInvoice ? Number(lastNos?.purchaseInvoice) + 1 : 1
      );
    }
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
        if (value?.supplierId) {
          const dept = suppliers.filter(
            (dep: any) => dep._id === value?.supplierId
          )?.[0];
          setSuppvalue(dept);
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
      const _id = row.supplierId;
      const supp = suppliers.filter((it: any) => it._id === _id)[0];

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

      setSuppvalue(supp);
      setIsCash(row.isCash);
      setDiscount(row.discount);
      setInvNo(row.docNo);
      handleDateChange(row.time);
      setPtype(row.paymentType ? row.paymentType : 'cash');
    }
  }, [row]);

  const getOverallTotal = () => {
    const products = itemsList.filter((li: any) => li.itemType === 1);
    // const nonstock = itemsList.filter((li: any) => li.itemType !== 1);

    const sumProducts =
      products?.length > 0 ? _(products).sumBy('itemtotal') : 0;
    // const sumNonstock =
    //   nonstock?.length > 0 ? _(nonstock).sumBy("itemtotal") : 0;
    const sum = _(itemsList).sumBy('itemtotal');

    const amount = sum - discount;
    const tots = {
      itemsSum: amount,
      total: sum,
      amount,
      costAmount: sumProducts,
    };
    setTotals(tots);

    const accs = [
      {
        debitAcc: accountCode.purchase_nonstock,
        creditAcc: accountCode.accounts_payable,
        amount: sum,
        // amount: sumNonstock, // non stock items
        type: operationTypes.purchaseInvoice,
      },
      {
        debitAcc: accountCode.accounts_payable,
        creditAcc: accountCode.cost_of_sales,
        amount: discount,
        type: operationTypes.supplierDiscount,
      },
      {
        debitAcc: accountCode.accounts_payable,
        creditAcc:
          ptype === 'cash' ? accountCode.cash_on_hand : accountCode.card,
        amount: isCash ? sum - discount : 0,
        type: operationTypes.supplierPayemnt,
      },
      {
        debitAcc: accountCode.inventory,
        creditAcc: accountCode.accounts_payable,
        amount: sumProducts, // stock items
        type: operationTypes.purchaseDelivery,
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
    if (!suppvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يرجى اضافة مورد للفاتورة' : 'Please add Supplier'
      );
      return;
    }
    if (isNew && Number(invNo) <= Number(lastNos.purchaseInvoice)) {
      await messageAlert(
        setAlrt,
        isRTL
          ? `رقم الفاتورة يجب ان يكون أكبر من ${lastNos.purchaseInvoice}`
          : `Invoice no must be more than ${lastNos.purchaseInvoice}`
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
    const { amount, total, costAmount } = totals;
    const isCash = true;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      docNo: invNo ? invNo.toString() : undefined,
      time: selectedDate,
      supplier: {
        supplierId: suppvalue._id,
        supplierName: suppvalue.name,
        supplierNameAr: suppvalue.nameAr,
        supplierPhone: suppvalue.phone,
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
      items: JSON.stringify(itemsList),
      costAmount,
      total,
      discount,
      amount,
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
      // if (row && row._id) {
      //   itemsData?.refetch();
      // }
      freshlastNos({});
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
    customerName: suppvalue?.name,
    customerPhone: suppvalue?.phone,
    total: totals.total,
    amount: totals.amount,
    items: itemsList,
  };

  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  const title = isRTL ? 'فاتورة شراء' : 'Purchase Invoice';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      saving={saving}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      print={!isNew ? handleReactPrint : undefined}
      maxWidth="md"
      mt={0}
      mb={50}
    >
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <CalenderLocal
            isRTL={isRTL}
            label={words.time}
            value={selectedDate}
            onChange={handleDateChange}
          ></CalenderLocal>
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
              disabled={!isNew}
              value={invNo}
              onChange={(e: any) => setInvNo(Number(e.target.value))}
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
            name="supplier"
            title={words.supplier}
            words={words}
            options={suppliers}
            value={suppvalue}
            setSelectValue={setSuppvalue}
            isRTL={isRTL}
            fullWidth
            openAdd={openSupplier}
            showphone
            disabled={name === 'supplierId'}
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
        {!tempoptions?.noRes && <Grid item xs={4}></Grid>}
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
        <Grid item xs={4}>
          <AutoFieldLocal
            name="department"
            title={tempwords?.department}
            words={words}
            options={departments}
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
              backgroundColor: '#f4f4f4',
              padding: 10,
              marginTop: 15,
              marginBottom: 15,
              borderRadius: 10,
            }}
          >
            <Box display="flex">
              <ProductItemForm
                products={servicesproducts}
                addItem={addItemToList}
                words={words}
                classes={classes}
                user={user}
                isRTL={isRTL}
                cost={true}
              ></ProductItemForm>
            </Box>
            {(isNew || itemsList.length > 0) && (
              <Box style={{ marginBottom: 20 }}>
                <ItemsTable
                  rows={itemsList}
                  products={servicesproducts}
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
          <PopupSupplier
            newtext={newtext}
            open={openSupp}
            onClose={onCloseSupplier}
            isNew={true}
            setNewValue={onNewSuppChange}
            row={null}
            addAction={addSupplier}
            editAction={editSupplier}
          ></PopupSupplier>
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

export default PopupPurchaseInvoice;
