/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert, yup, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import useAccounts from '../hooks/useAccounts';
import { operationTypes } from '../constants';
import { parents } from '../constants/kaid';
import PopupLayout from '../pages/main/PopupLayout';
import { Box, Grid } from '@material-ui/core';
import { useReactToPrint } from 'react-to-print';
import { CalenderLocal, TextFieldLocal } from '../components';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { useTemplate } from '../hooks';
import { ReceiptPrint } from '../print';
import { sleep, successAlert } from '../Shared/helpers';
import useEmployees from '../hooks/useEmployees';
import PopupEmployee from './PopupEmployee';

const PopupPaymentAdvance = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  name,
  value,
  company,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [credaccounts, setCredaccounts] = React.useState([]);

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);

  const [emplvalue, setEmplvalue] = useState<any>(
    name === 'employeeId' ? value : null
  );
  const [emplError, setEmplError] = useState<any>(false);

  const [newtext, setNewtext] = useState('');
  const [openEmp, setOpenEmp] = useState(false);

  const { register, handleSubmit, errors, reset } = useForm(
    yup.depositResolver
  );

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const { accounts } = useAccounts();
  const { employees, addEmployee, editEmployee } = useEmployees();
  const { tempwords } = useTemplate();

  const openEmployee = () => {
    setOpenEmp(true);
  };
  const onCloseEmploee = () => {
    setOpenEmp(false);
    setNewtext('');
  };
  const onNewEmplChange = (nextValue: any) => {
    setEmplvalue(nextValue);
  };

  useEffect(() => {
    if (row && row._id) {
      const ca = row.creditAcc;
      const da = row.debitAcc;

      const filteredcredit = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH
      );
      setCredaccounts(filteredcredit);

      if (ca) {
        const credit = accounts.filter((acc: any) => acc.code === ca)[0];
        setCreditAcc(credit);
      }
      if (da) {
        const debit = accounts.filter((acc: any) => acc.code === da)[0];
        setDebitAcc(debit);
      }
      const employeeId = row?.employeeId;
      if (employeeId) {
        const emp = employees.filter((it: any) => it._id === employeeId)[0];
        setEmplvalue(emp);
      }
      handleDateChange(row.time);
    } else {
      const filtereddebits = accounts.filter((acc: any) => acc.code === 1350);
      const filteredcredit = accounts.filter(
        (acc: any) => acc.parentcode === parents.CASH
      );
      setCredaccounts(filteredcredit);
      setDebitAcc(filtereddebits?.[0]);
      setCreditAcc(filteredcredit?.[0]);
    }
  }, [row, open]);

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice #${row?.docNo}`,
    removeAfterPrint: true,
  });
  const printData = {
    no: row?.docNo,
    time: selectedDate,
    refNo: row?.refNo,
    title: row?.title,
    desc: row?.desc,
    amount: row?.amount,
    isRTL: isRTL,
    chequeBank: row?.chequeBank,
    chequeNo: row?.chequeNo,
    chequeDate: row?.chequeDate,
  };
  const onSubmit = async (data: any) => {
    if (selectedDate > new Date()) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }
    const { amount, title, desc, chequeBank, chequeNo, chequeDate } = data;
    if (!creditAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الحساب' : 'You have to select Account'
      );
      return;
    }
    if (!emplvalue) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الموظف' : 'You have to select Employee'
      );
      return;
    }

    setSaving(true);
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

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: operationTypes.advancePayemnt,
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      employee,
      amount,
      chequeBank,
      chequeNo,
      chequeDate,
      title,
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
      await sleep(2);
      await successAlert(setAlrt, isRTL);
      setSaving(false);
      closeModal();
    } catch (error) {
      onError(error);
      setSaving(false);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      resetAll();
      console.log(error);
    }
  };
  const resetAll = () => {
    reset();
    setCreditAcc(null);
    setDebitAcc(null);
    setCredaccounts([]);
    setEmplvalue(name === 'employeeId' ? value : null);
    setSaving(false);
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
      title={words.payments}
      onSubmit={onHandleSubmit}
      theme={theme}
      saving={saving}
      alrt={alrt}
      print={!isNew ? handleReactPrint : undefined}
      mt={10}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.time}
                value={selectedDate}
                onChange={handleDateChange}
              ></CalenderLocal>
            </Grid>
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
                isRTL={isRTL}
                fullwidth
                openAdd={openEmployee}
                disabled={name === 'emploueeId' || name === 'contractId'}
                mb={0}
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={6}>
              <TextFieldLocal
                required
                name="amount"
                label={words.amount}
                register={register}
                errors={errors}
                row={row}
                type="number"
                fullWidth
                mb={0}
              />
            </Grid>

            <Grid item xs={12}>
              <AutoFieldLocal
                name="creditAcc"
                title={isRTL ? 'حساب الدفع' : 'Payment Acc'}
                words={words}
                options={credaccounts}
                value={creditAcc}
                setSelectValue={setCreditAcc}
                register={register}
                isRTL={isRTL}
                fullwidth
                mb={0}
              ></AutoFieldLocal>
            </Grid>

            <Grid item xs={12}>
              <TextFieldLocal
                name="desc"
                rows={4}
                label={words.for}
                register={register}
                errors={errors}
                row={row}
                multiline
                fullWidth
                mb={0}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
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
        <Box>
          <div style={{ display: 'none' }}>
            <ReceiptPrint
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

export default PopupPaymentAdvance;
