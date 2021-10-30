/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert, yup, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import useAccounts from '../hooks/useAccounts';
import { parents } from '../constants/kaid';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { CalenderLocal, TextFieldLocal } from '../components';
// import { getAppStartEndPeriod } from "../common/time";
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { useTemplate } from '../hooks';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useResoursesUp from '../hooks/useResoursesUp';

const PopupExpenses = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  tasks,
  name,
  value,
}: any) => {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [debaccounts, setDebaccounts] = React.useState([]);
  const [cridaccounts, setCridaccounts] = React.useState([]);

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);

  const [emplvalue, setEmplvalue] = useState<any>(
    name === 'employeeId' ? value : null
  );
  const [emplError, setEmplError] = useState<any>(false);

  const [resovalue, setResovalue] = useState<any>(
    name === 'resourseId' ? value : null
  );
  const [resoError, setResoError] = useState<any>(false);

  const [departvalue, setDepartvalue] = useState<any>(
    name === 'departmentId' ? value : null
  );
  const [departError, setDepartError] = useState<any>(false);

  const [taskvalue, setTaskvalue] = useState<any>(
    name === 'taskId' ? value : null
  );

  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();
  const { tempwords, tempoptions } = useTemplate();

  const { register, handleSubmit, errors, reset } = useForm(
    yup.depositResolver
  );

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const isemployee = user?.isEmployee && user?.employeeId;

  const { accounts } = useAccounts();

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
      if (name === 'employeeId') {
        if (value?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === value?.departmentId
          )?.[0];
          setDepartvalue(dept);
        }
      }
    }
  }, [open]);

  useEffect(() => {
    if (row && row._id) {
      const ca = row.creditAcc;
      const da = row.debitAcc;
      const depId = row.departmentId;
      const empId = row.employeeId;
      const taskId = row.taskId;
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
      if (taskId) {
        const tsk = tasks.filter((ts: any) => ts.id === taskId)[0];
        setTaskvalue(tsk);
      }
      const filtereddebits = accounts.filter(
        (acc: any) => acc.parentcode === parents.EXPENCES
      );
      setDebaccounts(filtereddebits);
      const filteredcredit = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH
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
        (acc: any) => acc.parentcode === parents.CASH
      );
      setCridaccounts(filteredcredit);
      setCreditAcc(filteredcredit?.[0]);
      setDebitAcc(filtereddebits?.[3]);
    }
  }, [row, open]);

  const onSubmit = async (data: any) => {
    const { amount, desc } = data;
    if (!debitAcc || !creditAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد كلا الحسابين' : 'You have to select both accounts'
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
    const department = departvalue
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
        };
    const customer = taskvalue
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
        };
    const employee = emplvalue
      ? {
          employeeId: emplvalue._id,
          employeeName: emplvalue.name,
          employeeNameAr: emplvalue.nameAr,
          employeeColor: emplvalue.color,
        }
      : {
          employeeId: undefined,
          employeeName: undefined,
          employeeNameAr: undefined,
          employeeColor: undefined,
        };
    const resourse = resovalue
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
        };

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      amount,
      taskId: taskvalue ? taskvalue.id : null,
      customer,
      department,
      employee,
      resourse,
      desc,
      branch: user.branch,
      userId: user._id,
    };

    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      closeModal();
    } catch (error) {
      onError(error);
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

  const resetAll = () => {
    reset();
    setCreditAcc(null);
    setDebitAcc(null);
    setDebaccounts([]);
    setCridaccounts([]);
    setEmplvalue(null);
    setEmplError(false);
    setResovalue(null);
    setResoError(false);
    setDepartvalue(null);
    setDepartError(false);
    setTaskvalue(null);
  };
  const closeModal = () => {
    resetAll();
    onClose();
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={words.expenses}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      mt={10}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.time}
                value={selectedDate}
                onChange={handleDateChange}
              ></CalenderLocal>
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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

            <Grid item xs={12}>
              <TextFieldLocal
                required
                name="amount"
                label={words.amount}
                register={register}
                errors={errors}
                row={row}
                type="number"
                width={203}
              />
              <AutoFieldLocal
                name="task"
                title={tempwords.task}
                words={words}
                options={tasks}
                value={taskvalue}
                setSelectValue={setTaskvalue}
                register={register}
                isRTL={isRTL}
                fullWidth
                disabled={name === 'taskId'}
              ></AutoFieldLocal>

              {!tempoptions?.noEmp && (
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
                  register={register}
                  noPlus
                  isRTL={isRTL}
                  fullWidth
                ></AutoFieldLocal>
              )}
              {!tempoptions?.noRes && (
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
                  register={register}
                  noPlus
                  isRTL={isRTL}
                  fullWidth
                ></AutoFieldLocal>
              )}
              <AutoFieldLocal
                name="department"
                title={tempwords.department}
                words={words}
                options={departments}
                value={departvalue}
                setSelectValue={setDepartvalue}
                setSelectError={setDepartError}
                selectError={departError}
                register={register}
                isRTL={isRTL}
                mb={20}
                disabled={name === 'departmentId'}
              ></AutoFieldLocal>
              <TextFieldLocal
                name="desc"
                multiline
                rows={4}
                label={words.description}
                register={register}
                errors={errors}
                row={row}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupExpenses;
