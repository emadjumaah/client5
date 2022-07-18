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
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { getCashBankPetty } from '../Shared/helpers';

const PopupFinance = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [ptype, setPtype] = React.useState('cashDeposet');
  const [debaccounts, setDebaccounts] = React.useState([]);
  const [cridaccounts, setCridaccounts] = React.useState([]);

  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);

  const { register, handleSubmit, errors, reset } = useForm(
    yup.depositResolver
  );

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const { accounts } = useAccounts();

  useEffect(() => {
    const cashaccounts = accounts.filter(
      (acc: any) => acc.parentcode === parents.CASH && acc.code < 10499
    );
    const pettyaccounts = accounts.filter(
      (acc: any) => acc.parentcode === parents.CASH && acc.code > 10499
    );
    if (row && row._id) {
      const ca = row.creditAcc;
      const da = row.debitAcc;
      const ot = row.opType;
      if (ot === 73) setPtype('pettyCashPay');
      if (ot === 74) setPtype('pettyCashRec');
      if (ot === 75) setPtype('cashDraw');
      if (ot === 76) setPtype('cashDeposet');

      const craccs = ot === 74 ? pettyaccounts : cashaccounts;
      const dbaccs = ot === 74 ? cashaccounts : pettyaccounts;
      setDebaccounts(dbaccs);
      setCridaccounts(craccs);

      if (ca) {
        const credit = accounts.filter((acc: any) => acc.code === ca)[0];
        setCreditAcc(credit);
      }
      if (da) {
        const debit = accounts.filter((acc: any) => acc.code === da)[0];
        setDebitAcc(debit);
      }
    } else {
      const { cash, bank } = getCashBankPetty(accounts);
      if (ptype === 'cashDeposet') {
        setDebaccounts(cashaccounts);
        setCridaccounts(cashaccounts);
        setCreditAcc(cash);
        setDebitAcc(bank);
      }
      if (ptype === 'cashDraw') {
        setDebaccounts(cashaccounts);
        setCridaccounts(cashaccounts);
        setCreditAcc(bank);
        setDebitAcc(cash);
      }
      if (ptype === 'pettyCashPay') {
        setDebaccounts(pettyaccounts);
        setCridaccounts(cashaccounts);
        setCreditAcc(cash);
        // setDebitAcc(null);
      }
      if (ptype === 'pettyCashRec') {
        setDebaccounts(cashaccounts);
        setCridaccounts(pettyaccounts);
        setCreditAcc(null);
        setDebitAcc(cash);
      }
    }
  }, [row, ptype, open, accounts]);

  useEffect(() => {
    if (ptype === 'pettyCashPay') {
      setDebitAcc(null);
    }
  }, [ptype]);

  const getActionType = () => {
    if (ptype === 'cashDeposet') {
      return operationTypes.cashDeposet;
    } else if (ptype === 'cashDraw') {
      return operationTypes.cashDraw;
    } else if (ptype === 'pettyCashPay') {
      return operationTypes.pettyCashPay;
    } else if (ptype === 'pettyCashRec') {
      return operationTypes.pettyCashRec;
    }
    return null;
  };
  const onSubmit = async (data: any) => {
    if (selectedDate > new Date()) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تعديل التاريخ' : 'Date should be change'
      );
      return;
    }
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
    const { amount, desc } = data;
    if (!amount || amount <= 0) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب اضافة المبلغ' : 'Amount required'
      );
      return;
    }
    setSaving(true);

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: getActionType(),
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      amount,
      desc,
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
    setPtype('cashDeposet');
    setCreditAcc(null);
    setDebitAcc(null);
    setDebaccounts([]);
    setCridaccounts([]);
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
  const title = isRTL ? 'حركة مالية' : 'Finance';
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
      maxWidth="md"
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
                isRTL={isRTL}
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
                // disabled={ptype === 'pettyCashRec' || ptype === 'cashDeposet'}
                isRTL={isRTL}
                fullwidth
                mb={0}
              ></AutoFieldLocal>
            </Grid>
            <Grid item xs={6}>
              <AutoFieldLocal
                name="debitAcc"
                title={words.to}
                words={words}
                options={debaccounts}
                value={debitAcc}
                // openAdd={ptype === 'pettyCashPay' ? openAccount : undefined}
                // disabled={ptype === 'pettyCashPay' || ptype === 'cashDraw'}
                setSelectValue={setDebitAcc}
                register={register}
                isRTL={isRTL}
                fullwidth
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
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
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
