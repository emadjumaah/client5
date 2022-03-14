/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { invoiceClasses } from '../themes';
import { useCustomers, useTemplate } from '../hooks';
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
import { getAppStartEndPeriod } from '../common/time';
import { CalenderLocal, TextFieldLocal } from '../components';
// import { useReactToPrint } from 'react-to-print';
import { InvoicePrintA5 } from '../common/InvoicePrintA5';
import { weekdaysNNo } from '../constants/datatypes';
import useTasks from '../hooks/useTasks';
import useCompany from '../hooks/useCompany';
import PopupDeprtment from './PopupDeprtment';
import PopupTask from './PopupTask';
import PopupEmployee from './PopupEmployee';
import PopupResourses from './PopupResourses';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import useProjects from '../hooks/useProjects';
import ExpensesItemForm from '../Shared/ExpensesItemForm';
import ExpensesItemsTable from '../Shared/ExpensesItemsTable';
import { parents } from '../constants/kaid';
import useAccounts from '../hooks/useAccounts';

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
  const [loading, setLoading] = useState(false);
  const { tasks } = useTasks();
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [debaccounts, setDebaccounts] = React.useState([]);
  const [cridaccounts, setCridaccounts] = React.useState([]);

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);

  const [itemsList, setItemsList] = useState<any>([]);

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

  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'taskId' ? value : null
  );

  const [newtext, setNewtext] = useState('');
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);
  const [openTsk, setOpenTsk] = useState(false);
  const { customers } = useCustomers();
  const { addDepartment, editDepartment } = useDepartmentsUp();
  const { addEmployee, editEmployee } = useEmployeesUp();
  const { addResourse, editResourse } = useResoursesUp();
  const { addTask, editTask } = useTasks();
  const { tempwords, tempoptions } = useTemplate();
  const { accounts } = useAccounts();

  const { projects } = useProjects();

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
  const openTask = () => {
    setOpenTsk(true);
  };
  const onCloseTask = () => {
    setOpenTsk(false);
    setNewtext('');
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
  const onNewTaskChange = (nextValue: any) => {
    setTaskvalue(nextValue);
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
    }
  }, [taskvalue]);

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
        };
      });
      itemsWqtyprice.sort((a: any, b: any) =>
        a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
      );
      setItemsList(itemsWqtyprice);
      setLoading(false);
    }
  }, [itemsData]);

  const { handleSubmit, register, reset, errors } = useForm({});

  const resetAllForms = () => {
    reset();
    setCreditAcc(null);
    setDebitAcc(null);
    setDebaccounts([]);
    setCridaccounts([]);
    setItemsList([]);
    setTotals({});
    setTaskvalue(null);
    setSelectedDate(new Date());
    setDepartvalue(null);
    setEmplvalue(null);
    setResovalue(null);
  };

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

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (isNew) {
      if (name === 'taskId') {
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
      }
    }
  }, [open]);

  useEffect(() => {
    getOverallTotal();
  }, [itemsList]);

  useEffect(() => {
    if (row && row._id) {
      const ca = row.creditAcc;
      const da = row.debitAcc;
      setLoading(true);
      const variables = { opId: row._id };
      getItems({
        variables,
      });
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

      if (!task && row.taskId) {
        const tsk = tasks.filter((ts: any) => ts.id === row.taskId)[0];
        setTaskvalue(tsk);
      }
      const filtereddebits = accounts.filter(
        (acc: any) => acc.parentcode === parents.EXPENCES
      );
      setDebaccounts(filtereddebits);
      const filteredcredit = accounts.filter(
        (acc: any) =>
          acc.parentcode === parents.CASH ||
          acc.parentcode === parents.ACCOUNTS_PAYABLE
      );
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
    } else {
      const filtereddebits = accounts.filter(
        (acc: any) => acc.parentcode === parents.EXPENCES
      );
      setDebaccounts(filtereddebits);
      const filteredcredit = accounts.filter(
        (acc: any) =>
          acc.parentcode === parents.CASH ||
          acc.parentcode === parents.ACCOUNTS_PAYABLE
      );
      setCridaccounts(filteredcredit);
      setCreditAcc(filteredcredit?.[0]);
      setDebitAcc(filtereddebits?.[3]);
    }
  }, [row]);

  const getOverallTotal = () => {
    const totalsin = itemsList.map((litem: any) => litem.itemtotal);
    const amount = totalsin.reduce((psum: any, a: any) => psum + a, 0);
    setTotals({ amount });
  };

  const onSubmit = async (data: any) => {
    const { startPeriod, endPeriod } = getAppStartEndPeriod();
    if (selectedDate < startPeriod || selectedDate > endPeriod) {
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
    if (debitAcc === creditAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? 'الحسابات يجب ان تكون مختلفة' : 'The accounts must be deferent'
      );
      return;
    }

    const { desc } = data;

    const { amount } = totals;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      amount,
      taskId: taskvalue ? taskvalue.id : null,

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
      items: JSON.stringify(itemsList),
      desc,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    console.log('variables', variables);
    // return;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      if (row && row._id) {
        itemsData?.refetch();
      }
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
  // const handleReactPrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: `Invoice #${row?.invoiceNo}`,
  //   removeAfterPrint: true,
  // });
  const printData = {
    invoiceNo: row?.invoiceNo,
    total: totals.total,
    amount: totals.amount,
    items: itemsList,
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
      maxWidth="md"
      mt={0}
      mb={50}
    >
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <CalenderLocal
            isRTL={isRTL}
            label={words.time}
            value={selectedDate}
            onChange={handleDateChange}
          ></CalenderLocal>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={2} style={{ marginTop: 10 }}>
            <Grid item xs={4}>
              <AutoFieldLocal
                name="debitAcc"
                title={isRTL ? 'حساب المصروف' : 'Expenses Acc'}
                words={words}
                options={debaccounts}
                value={debitAcc}
                setSelectValue={setDebitAcc}
                register={register}
                isRTL={isRTL}
                fullwidtth
              ></AutoFieldLocal>
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
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <AutoFieldLocal
            name="task"
            title={tempwords.task}
            words={words}
            options={tasks}
            value={taskvalue}
            setSelectValue={setTaskvalue}
            isRTL={isRTL}
            fullWidth
            openAdd={openTask}
            disabled={name === 'taskId'}
          ></AutoFieldLocal>
        </Grid>
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
            openAdd={openDepartment}
            isRTL={isRTL}
            fullWidth
            disabled={name === 'departmentId'}
          ></AutoFieldLocal>
        </Grid>
        <Grid item xs={3}></Grid>

        {!tempoptions?.noEmp && (
          <Grid item xs={5}>
            <AutoFieldLocal
              name="employee"
              title={tempwords.employee}
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
        {!tempoptions?.noRes && (
          <Grid item xs={4}>
            <AutoFieldLocal
              name="resourse"
              title={tempwords.resourse}
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
        <Grid item xs={9}>
          <TextFieldLocal
            name="desc"
            multiline
            rows={3}
            label={words.description}
            register={register}
            errors={errors}
            row={row}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: '#f3f3f3',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Box display="flex" style={{ paddingLeft: 10, paddingRight: 10 }}>
              <ExpensesItemForm
                options={servicesproducts}
                addItem={addItemToList}
                words={words}
                classes={classes}
                user={user}
                isRTL={isRTL}
              ></ExpensesItemForm>
            </Box>
            {!loading && (
              <Box style={{ marginBottom: 20 }}>
                <ExpensesItemsTable
                  rows={itemsList}
                  editItem={editItemInList}
                  removeItem={removeItemFromList}
                  isRTL={isRTL}
                  words={words}
                  user={user}
                ></ExpensesItemsTable>
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
            <PriceTotal
              amount={totals?.amount}
              total={totals?.total}
              words={words}
              totalonly
            ></PriceTotal>
          </Box>
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
          <PopupTask
            newtext={newtext}
            open={openTsk}
            onClose={onCloseTask}
            isNew={true}
            setNewValue={onNewTaskChange}
            row={null}
            employees={employees}
            resourses={resourses}
            departments={departments}
            projects={projects}
            customers={customers}
            addAction={addTask}
            editAction={editTask}
          ></PopupTask>
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
              <InvoicePrintA5
                company={company}
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

export default PopupExpensesDoc;