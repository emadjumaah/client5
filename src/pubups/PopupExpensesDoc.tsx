/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { invoiceClasses } from '../themes';
import { useSuppliers, useTemplate } from '../hooks';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box } from '@material-ui/core';
import { PriceTotal } from '../Shared/TotalPrice';
import { useLazyQuery } from '@apollo/client';
import { getOperationItems } from '../graphql';
import LoadingInline from '../Shared/LoadingInline';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { CalenderLocal, TextFieldLocal } from '../components';
import { operationTypes, weekdaysNNo } from '../constants/datatypes';
import useTasks from '../hooks/useTasks';
import useCompany from '../hooks/useCompany';
import PopupDeprtment from './PopupDeprtment';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartments from '../hooks/useDepartments';
import useEmployees from '../hooks/useEmployees';
import useResourses from '../hooks/useResourses';
import ExpensesItemForm from '../Shared/ExpensesItemForm';
import ExpensesItemsTable from '../Shared/ExpensesItemsTable';
import { parents } from '../constants/kaid';
import useAccounts from '../hooks/useAccounts';
import { useReactToPrint } from 'react-to-print';
import { VoucherPrint } from '../print';
import { successAlert } from '../Shared/helpers';
import ExpensesTypeSelect from '../pages/options/ExpensesTypeSelect';
import PopupSupplier from './PopupSupplier';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupExpensesDoc = ({
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
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [cridaccounts, setCridaccounts] = React.useState([]);
  const [ptype, setPtype] = React.useState('expenses');

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);
  const [itemsList, setItemsList] = useState<any>([]);

  const [totals, setTotals] = useState<any>({});

  const { tasks } = useTasks();
  const { company } = useCompany();
  const { accounts } = useAccounts();
  const [departvalue, setDepartvalue] = useState<any>(
    name === 'departmentId' ? value : null
  );
  const [departError, setDepartError] = useState<any>(false);
  const departRef: any = React.useRef();
  const [suppvalue, setSuppvalue] = useState<any>(
    name === 'departmentId' ? value : null
  );
  const [suppError, setSuppError] = useState<any>(false);
  const suppRef: any = React.useRef();

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

  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'contractId' ? value : null
  );

  const [newtext, setNewtext] = useState('');
  const [openSupp, setOpenSupp] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);
  const { addDepartment, editDepartment } = useDepartments();
  const { addEmployee, editEmployee } = useEmployees();
  const { addResourse, editResourse } = useResourses();
  const { addSupplier, editSupplier } = useSuppliers();
  const { tempwords, tempoptions } = useTemplate();

  const { suppliers } = useSuppliers();
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
  const openSupplier = () => {
    setOpenSupp(true);
  };
  const onCloseSupplier = () => {
    setOpenSupp(false);
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

  const onNewDepartChange = (nextValue: any) => {
    setDepartvalue(nextValue);
  };
  const onNewSuppChange = (nextValue: any) => {
    setSuppvalue(nextValue);
  };
  const onNewEmplChange = (nextValue: any) => {
    setEmplvalue(nextValue);
  };
  const onNewResoChange = (nextValue: any) => {
    setResovalue(nextValue);
  };

  useEffect(() => {
    if (row && row._id) {
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
        setLoading(false);
      }
    }
  }, [itemsData]);

  const { handleSubmit, register, reset, errors } = useForm({});

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
    getOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (name === 'contractId') {
      setTaskvalue(value);
    }
  }, [name, value, open]);

  useEffect(() => {
    if (isNew) {
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
      }
    }
  }, [taskvalue, open]);

  useEffect(() => {
    if (row && row._id) {
      const payableaccounts = accounts.filter(
        (acc: any) => acc.parentcode === parents.ACCOUNTS_PAYABLE
      );
      const cashaccounts = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH && acc.code < 10499
      );
      const pettyaccounts = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH && acc.code > 10499
      );
      const ca = row.creditAcc;
      const da = row.debitAcc;
      const ot = row.opType;
      const variables = { opId: row._id };
      getItems({
        variables,
      });
      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;
      const suppId = row.supplierId;
      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (empId) {
        const empl = employees.filter((emp: any) => emp._id === empId)[0];
        setEmplvalue(empl);
      }
      if (resId) {
        const reso = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(reso);
      }
      if (suppId) {
        const supp = suppliers.filter((emp: any) => emp._id === suppId)[0];
        setSuppvalue(supp);
      }

      if (!task && row.contractId) {
        const tsk = tasks.filter((ts: any) => ts._id === row.contractId)[0];
        setTaskvalue(tsk);
      }
      if (ot === 60) setPtype('expenses');
      if (ot === 62) setPtype('exppettycash');
      if (ot === 63) setPtype('exppayable');

      const filteredcredit =
        ot === 63 ? payableaccounts : ot === 62 ? pettyaccounts : cashaccounts;
      setCridaccounts(filteredcredit);

      if (ca) {
        const credit = accounts.filter((acc: any) => acc.code === ca)[0];
        setCreditAcc(credit);
      }
      if (da) {
        const debit = accounts.filter((acc: any) => acc.code === da)[0];
        setDebitAcc(debit);
      }
      handleDateChange(row.time);
    }
  }, [open, accounts]);

  useEffect(() => {
    const payableaccounts = accounts.filter(
      (acc: any) => acc.parentcode === parents.ACCOUNTS_PAYABLE
    );
    const cashaccounts = accounts.filter(
      (acc: any) => acc.parentcode === parents.CASH && acc.code < 10499
    );
    const pettyaccounts = accounts.filter(
      (acc: any) => acc.parentcode === parents.CASH && acc.code > 10499
    );
    const filtereddebits = accounts.filter(
      (acc: any) => acc.parentcode === parents.EXPENCES
    );

    const filteredcredit =
      ptype === 'exppayable'
        ? payableaccounts
        : ptype === 'exppettycash'
        ? pettyaccounts
        : cashaccounts;
    setCridaccounts(filteredcredit);
    if (ptype === 'exppayable' || ptype === 'expenses') {
      setCreditAcc(filteredcredit?.[0]);
    }
    setDebitAcc(filtereddebits?.[0]);
  }, [open, ptype]);

  useEffect(() => {
    if (ptype === 'exppettycash') {
      setCreditAcc(null);
    }
  }, [ptype]);

  const getActionType = () => {
    if (ptype === 'expenses') {
      return operationTypes.expenses;
    } else if (ptype === 'exppettycash') {
      return operationTypes.exppettycash;
    } else if (ptype === 'exppayable') {
      return operationTypes.exppayable;
    }
    return null;
  };

  const getOverallTotal = () => {
    const totalsin = itemsList.map((litem: any) => litem.itemtotal);
    const amount = totalsin.reduce((psum: any, a: any) => psum + a, 0);
    setTotals({ amount });
  };

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Voucher #${row?.docNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    no: row?.docNo,
    time: selectedDate,
    title: row?.title,
    desc: row?.desc,
    amount: row?.amount,
    isRTL: isRTL,
    chequeBank: row?.chequeBank,
    chequeNo: row?.chequeNo,
    chequeDate: row?.chequeDate,
    task: taskvalue,
    items: itemsList,
    supplier: suppvalue,
    resourse: resovalue,
  };
  const onSubmit = async (data: any) => {
    if (selectedDate > new Date()) {
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
          ? `يجب اضافة عنصر (مصروف) واحد للمستند على الأقل`
          : `You should add min one expense to document`
      );
      return;
    }
    if (!creditAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الحساب' : 'You have to select Account'
      );
      return;
    }
    if (ptype === 'exppayable' && !suppvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد المورد' : 'You have to select Supplier'
      );
      return;
    }
    setSaving(true);

    const { title, desc, chequeBank, chequeNo, chequeDate } = data;

    const { amount } = totals;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: getActionType(),
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      amount,
      customer: taskvalue
        ? {
            customerId: taskvalue.customerId,
            customerName: taskvalue.customerName,
            customerNameAr: taskvalue.customerNameAr,
            customerPhone: taskvalue.customerPhone,
          }
        : {
            customerId: undefined,
            customerName: undefined,
            customerNameAr: undefined,
            customerPhone: undefined,
          },

      supplier: suppvalue
        ? {
            supplierId: suppvalue._id,
            supplierName: suppvalue.name,
            supplierNameAr: suppvalue.nameAr,
          }
        : {
            departmentId: undefined,
            departmentName: undefined,
            departmentNameAr: undefined,
            departmentColor: undefined,
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
      title,
      desc,
      chequeBank,
      chequeNo,
      chequeDate,
      branch: user.branch,
      userId: user._id,
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

  const resetAllForms = () => {
    reset();
    setCreditAcc(null);
    setDebitAcc(null);
    setItemsList([]);
    setTotals({});
    setSelectedDate(new Date());
    setSuppvalue(null);
    setLoading(false);
    setDepartvalue(name === 'departmentId' ? value : null);
    setEmplvalue(name === 'employeeId' ? value : null);
    setResovalue(name === 'resourseId' ? value : null);
    setTaskvalue(name === 'contractId' ? value : null);
    setSaving(false);
    setPtype('expenses');
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
      ? 'اضافة مصروف'
      : 'تعديل مصروف'
    : isNew
    ? 'New Expenses'
    : 'Edit Expenses';
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
      mb={20}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <ExpensesTypeSelect
            ptype={ptype}
            setPtype={setPtype}
            setEmplvalue={setEmplvalue}
            setSuppvalue={setSuppvalue}
            isRTL={isRTL}
          ></ExpensesTypeSelect>
        </Grid>
        <Grid item xs={4} style={{ marginTop: -15 }}>
          <CalenderLocal
            isRTL={isRTL}
            label={words.time}
            value={selectedDate}
            onChange={handleDateChange}
          ></CalenderLocal>
        </Grid>
        <Grid item xs={4}>
          <AutoFieldLocal
            name="creditAcc"
            title={isRTL ? 'حساب الدفع' : 'Payment Acc'}
            words={words}
            options={cridaccounts}
            value={creditAcc}
            setSelectValue={setCreditAcc}
            register={register}
            isRTL={isRTL}
            fullwidtth
            mb={0}
            nosort
          ></AutoFieldLocal>
        </Grid>
        {ptype === 'expenses' && <Grid item xs={4}></Grid>}

        {ptype === 'exppayable' && (
          <Grid item xs={4}>
            <AutoFieldLocal
              name="supplier"
              title={words?.supplier}
              words={words}
              options={suppliers}
              value={suppvalue}
              setSelectValue={setSuppvalue}
              setSelectError={setSuppError}
              selectError={suppError}
              refernce={suppRef}
              openAdd={openSupplier}
              isRTL={isRTL}
              fullWidth
              disabled={name === 'suppmentId'}
              mb={0}
            ></AutoFieldLocal>
          </Grid>
        )}
        {!tempoptions?.noTsk && (
          <Grid item xs={6}>
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
              mb={0}
            ></AutoFieldLocal>
          </Grid>
        )}
        <Grid item xs={6}>
          <AutoFieldLocal
            name="employee"
            title={tempwords?.employee}
            words={words}
            options={employees}
            value={emplvalue}
            disabled={
              isemployee || name === 'employeeId' || name === 'contractId'
            }
            setSelectValue={setEmplvalue}
            setSelectError={setEmplError}
            selectError={emplError}
            refernce={emplRef}
            openAdd={openEmployee}
            isRTL={isRTL}
            fullWidth
            day={day}
            mb={0}
          ></AutoFieldLocal>
        </Grid>
        {!tempoptions?.noRes && (
          <Grid item xs={6}>
            <AutoFieldLocal
              name="resourse"
              title={tempwords?.resourse}
              words={words}
              options={resourses}
              value={resovalue}
              disabled={name === 'resourseId' || name === 'contractId'}
              setSelectValue={setResovalue}
              setSelectError={setResoError}
              selectError={resoError}
              refernce={resoRef}
              openAdd={openResourse}
              isRTL={isRTL}
              fullWidth
              day={day}
              mb={0}
            ></AutoFieldLocal>
          </Grid>
        )}
        <Grid item xs={6}>
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
            disabled={name === 'departmentId' || name === 'contractId'}
            mb={0}
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: '#f3f3f3',
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Box display="flex" style={{ paddingLeft: 10, paddingRight: 10 }}>
              <ExpensesItemForm
                items={servicesproducts}
                addItem={addItemToList}
                words={words}
                classes={classes}
                user={user}
                isRTL={isRTL}
                setAlrt={setAlrt}
                opType={60}
              ></ExpensesItemForm>
            </Box>
            {!loading && (
              <Box style={{ marginBottom: 10 }}>
                <ExpensesItemsTable
                  rows={itemsList}
                  editItem={editItemInList}
                  removeItem={removeItemFromList}
                  isRTL={isRTL}
                  words={words}
                  user={user}
                  products={servicesproducts}
                ></ExpensesItemsTable>
              </Box>
            )}
            {loading && <LoadingInline></LoadingInline>}
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <TextFieldLocal
            name="chequeBank"
            label={words.chequeBank}
            register={register}
            errors={errors}
            row={row}
            fullWidth
            mb={0}
          />
        </Grid>
        <Grid item xs={3}>
          <TextFieldLocal
            name="chequeNo"
            label={words.chequeNo}
            register={register}
            errors={errors}
            row={row}
            fullWidth
            mb={0}
          />
        </Grid>
        <Grid item xs={3}>
          <TextFieldLocal
            name="chequeDate"
            label={words.chequeDate}
            register={register}
            errors={errors}
            row={row}
            fullWidth
            mb={0}
          />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <TextFieldLocal
            name="desc"
            label={words.description}
            register={register}
            multiline
            rows={3}
            errors={errors}
            row={row}
            fullWidth
            mb={0}
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            style={{
              alignItems: 'center',
              marginRight: 10,
              marginLeft: 10,
            }}
          >
            <PriceTotal
              amount={totals?.amount ? totals?.amount : row?.amount}
              total={totals?.total}
              words={words}
              totalonly
              end={false}
            ></PriceTotal>
          </Box>
        </Grid>
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
            <VoucherPrint
              company={company}
              user={user}
              printData={printData}
              ref={componentRef}
            />
          </div>
        </Box>
      </Grid>
    </PopupLayout>
  );
};

export default PopupExpensesDoc;
