/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  successAlert,
  dublicateAlert,
  errorAlert,
  yup,
  messageAlert,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box } from '@material-ui/core';
import useAccounts from '../hooks/useAccounts';
import { operationTypes } from '../constants';
import { parents } from '../constants/kaid';
import CashTransfareSelect from '../pages/options/CashTransfareSelect';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { CalenderLocal, TextFieldLocal } from '../components';
import { getAppStartEndPeriod } from '../common/time';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { useCustomers } from '../hooks';

const PopupFinance = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  setVars,
}: any) => {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [ptype, setPtype] = React.useState('deposit');
  const [debaccounts, setDebaccounts] = React.useState([]);
  const [cridaccounts, setCridaccounts] = React.useState([]);

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);

  const [custvalue, setCustvalue] = useState<any>(null);

  const { register, handleSubmit, errors, reset } = useForm(
    yup.depositResolver
  );

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const { accounts } = useAccounts();
  const { customers } = useCustomers();

  useEffect(() => {
    if (row && row._id) {
      const ca = row.creditAcc;
      const da = row.debitAcc;
      const ot = row.opType;
      if (ot === 70) {
        setPtype('deposit');
        const filtereddebits = accounts.filter(
          (acc: any) => acc.parentcode === parents.CASH
        );
        setDebaccounts(filtereddebits);
        setCridaccounts(filtereddebits);
      }
      if (ot === 71) {
        setPtype('partnerdraw');
        const filtereddebits = accounts.filter(
          (acc: any) => acc.parentcode === parents.OTHER_CURRENT_LIABILITIES
        );
        setDebaccounts(filtereddebits);
        const filteredcredit = accounts.filter(
          (acc: any) => acc.parentcode === parents.CASH
        );
        setCridaccounts(filteredcredit);
      }
      if (ot === 72) {
        setPtype('partneradd');
        const filtereddebits = accounts.filter(
          (acc: any) => acc.parentcode === parents.OTHER_CURRENT_LIABILITIES
        );
        setCridaccounts(filtereddebits);
        const filteredcredit = accounts.filter(
          (acc: any) => acc.parentcode === parents.CASH
        );
        setDebaccounts(filteredcredit);
      }
      if (ot === 14) {
        setPtype('customerpay');
        const filtereddebits = accounts.filter(
          (acc: any) => acc.parentcode === parents.ACCOUNTS_RECEIVABLE
        );
        setCridaccounts(filtereddebits);
        const filteredcredit = accounts.filter(
          (acc: any) => acc.parentcode === parents.CASH
        );
        setDebaccounts(filteredcredit);
      }

      if (ca) {
        const credit = accounts.filter((acc: any) => acc.code === ca)[0];
        setCreditAcc(credit);
      }
      if (da) {
        const debit = accounts.filter((acc: any) => acc.code === da)[0];
        setDebitAcc(debit);
      }
      const customerId = row?.customerId;
      if (customerId) {
        const cust = customers.filter((it: any) => it._id === customerId)[0];
        setCustvalue(cust);
      }
    } else {
      if (ptype === 'deposit') {
        const filtereddebits = accounts.filter(
          (acc: any) => acc.parentcode === parents.CASH
        );
        setDebaccounts(filtereddebits);
        setCridaccounts(filtereddebits);
        setCreditAcc(filtereddebits?.[0]);
        setDebitAcc(filtereddebits?.[2]);
      }
      if (ptype === 'partnerdraw') {
        const filtereddebits = accounts.filter(
          (acc: any) => acc.parentcode === parents.OTHER_CURRENT_LIABILITIES
        );
        setDebaccounts(filtereddebits);
        const filteredcredit = accounts.filter(
          (acc: any) => acc.parentcode === parents.CASH
        );
        setCridaccounts(filteredcredit);
        setCreditAcc(filteredcredit?.[0]);
        setDebitAcc(filtereddebits?.[0]);
      }
      if (ptype === 'partneradd') {
        const filtereddebits = accounts.filter(
          (acc: any) => acc.parentcode === parents.OTHER_CURRENT_LIABILITIES
        );
        setCridaccounts(filtereddebits);
        const filteredcredit = accounts.filter(
          (acc: any) => acc.parentcode === parents.CASH
        );
        setDebaccounts(filteredcredit);
        setDebitAcc(filteredcredit?.[0]);
        setCreditAcc(filtereddebits?.[0]);
      }
    }
  }, [row, ptype, open]);

  const getActionType = () => {
    if (ptype === 'deposit') {
      return operationTypes.deposet;
    } else if (ptype === 'partneradd') {
      return operationTypes.ownerDeposit;
    } else if (ptype === 'partnerdraw') {
      return operationTypes.ownerDraw;
    }
    return null;
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
    if (selectedDate > new Date()) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }
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

    const customer = {
      customerId: custvalue?._id,
      customerName: custvalue?.name,
      customerNameAr: custvalue?.nameAr,
      customerPhone: custvalue?.phone,
    };

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: getActionType(),
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      customer: custvalue ? customer : undefined,
      amount,
      desc,
      branch: user.branch,
      userId: user._id,
    };
    if (setVars) setVars(variables);
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
      successAlert(setAlrt, isRTL);
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
      resetAll();
      console.log(error);
    }
  };

  const resetAll = () => {
    reset();
    setPtype('deposit');
    setCreditAcc(null);
    setDebitAcc(null);
    setDebaccounts([]);
    setCridaccounts([]);
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
      title={words.depdraw}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      mt={10}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.time}
                value={selectedDate}
                onChange={handleDateChange}
              ></CalenderLocal>

              <Box style={{ marginBottom: 20 }}></Box>
            </Grid>
            <Grid item xs={12}>
              <CashTransfareSelect
                ptype={ptype}
                setPtype={setPtype}
                setCustvalue={setCustvalue}
                words={words}
              ></CashTransfareSelect>
              <Box style={{ marginBottom: 20 }}></Box>
            </Grid>
            <Grid item xs={6}>
              <AutoFieldLocal
                name="creditAcc"
                title={words.from}
                words={words}
                options={cridaccounts}
                value={creditAcc}
                setSelectValue={setCreditAcc}
                register={register}
                isRTL={isRTL}
                fullwidth
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={6}>
              <AutoFieldLocal
                name="debitAcc"
                title={words.to}
                words={words}
                options={debaccounts}
                value={debitAcc}
                setSelectValue={setDebitAcc}
                register={register}
                isRTL={isRTL}
                fullwidth
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={12}>
              <Box style={{ marginBottom: 10 }}></Box>

              <TextFieldLocal
                required
                name="amount"
                label={words.amount}
                register={register}
                errors={errors}
                row={row}
                type="number"
                fullWidth
              />
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
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupFinance;
