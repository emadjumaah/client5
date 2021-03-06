/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  // Box,
  Fab,
  // FormControlLabel,
  // Radio,
  // RadioGroup,
} from '@material-ui/core';
import useAccounts from '../hooks/useAccounts';
import { operationTypes } from '../constants';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { CalenderLocal, TextFieldLocal } from '../components';
import { getAppStartEndPeriod } from '../common/time';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import KaidsTable from '../Shared/KaidsTable';
import AddIcon from '@material-ui/icons/Add';
import { useLazyQuery } from '@apollo/client';
import getOperationKaids from '../graphql/query/getOperationKaids';
import LoadingInline from '../Shared/LoadingInline';
import _ from 'lodash';
import { successAlert } from '../Shared/helpers';
// import { useDepartments, useEmployees, useTemplate } from '../hooks';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupFinanceAll = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [debaccounts, setDebaccounts] = React.useState([]);
  const [cridaccounts, setCridaccounts] = React.useState([]);

  const [amount, setAmount]: any = React.useState(0);
  const [kaidsum, setKaidsum]: any = React.useState(0);
  const [desc, setDesc]: any = React.useState('');
  const [debitAcc, setDebitAcc]: any = React.useState(null);
  const [creditAcc, setCreditAcc]: any = React.useState(null);
  const crdRef: any = React.useRef();

  const [itemsList, setItemsList] = useState<any>([]);

  const [maindesc, setMaindesc] = useState<any>('');
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [getItems, itemsData]: any = useLazyQuery(getOperationKaids);

  const { accounts } = useAccounts();
  useEffect(() => {
    const items = itemsData?.data?.['getOperationKaids']?.data || [];
    if (items && items.length > 0) {
      const data = _(items)
        .groupBy('shareId')
        .map((array) => {
          const debitAcc = array.filter((ari: any) => ari.debit)?.[0]?.accCode;
          const creditAcc = array.filter((ari: any) => ari.credit)?.[0]
            ?.accCode;
          const amount = array[0]?.amount;
          const desc = array[0]?.desc;
          const time = array[0]?.opTime;
          return {
            time,
            debitAcc,
            creditAcc,
            amount,
            desc,
            branch: user.branch,
            userId: user._id,
          };
        })
        .value();
      const listwithindex = indexTheList(data);
      setItemsList(listwithindex);
      const sum = _.sumBy(listwithindex, 'amount');
      setKaidsum(sum);
      setLoading(false);
    }
  }, [itemsData]);

  useEffect(() => {
    setDebaccounts(accounts);
    setCridaccounts(accounts);
  }, [open]);

  useEffect(() => {
    if (row && row._id) {
      setLoading(true);
      const variables = { opId: row._id };
      getItems({
        variables,
      });

      setMaindesc(row.desc);

      handleDateChange(row.time);
    }
  }, [row]);

  const addItemToList = async () => {
    if (!debitAcc || !creditAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? '?????? ?????????? ?????? ????????????????' : 'You have to select both accounts'
      );
      return;
    }
    if (debitAcc === creditAcc) {
      await messageAlert(
        setAlrt,
        isRTL ? '???????????????? ?????? ???? ???????? ????????????' : 'The accounts must be deferent'
      );
      return;
    }
    const item = {
      time: selectedDate,
      debitAcc: debitAcc.code,
      creditAcc: creditAcc.code,
      amount,
      desc,
      branch: user.branch,
      userId: user._id,
    };
    const newArray = [...itemsList, { ...item, userId: user._id }];
    const listwithindex = indexTheList(newArray);
    setItemsList(listwithindex);
    resetForm();
    crdRef.current.focus();
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

  const onSubmit = async () => {
    const { startPeriod, endPeriod } = getAppStartEndPeriod();
    if (selectedDate < startPeriod || selectedDate > endPeriod) {
      await messageAlert(
        setAlrt,
        isRTL ? '?????? ?????????? ??????????????' : 'Date should be change'
      );
      return;
    }
    if (selectedDate > new Date()) {
      await messageAlert(
        setAlrt,
        isRTL ? '?????? ?????????? ??????????????' : 'Date should be change'
      );
      return;
    }
    if (!itemsList || itemsList.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL ? '???? ???????? ???????? ????????????' : 'No Items to be saved'
      );
      return;
    }
    setSaving(true);

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: operationTypes.kaid,
      time: selectedDate,
      items: JSON.stringify(itemsList),
      // department,
      // employee,
      desc: maindesc,
      branch: user.branch,
      userId: user._id,
      amount: kaidsum,
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
      console.log(error);
    }
  };

  const resetForm = () => {
    setAmount(0);
    setDesc('');
    setCreditAcc(null);
    setDebitAcc(null);
  };
  const resetAll = () => {
    resetForm();
    setDebaccounts([]);
    setCridaccounts([]);
    setItemsList([]);
    setSaving(false);
    // setDepartvalue(null);
    // setDepartError(false);
    // setEmplvalue(null);
    // setEmplError(false);
    // setResKind(null);
    // setEmplslist([]);
    setMaindesc('');
  };
  const closeModal = () => {
    resetAll();
    onClose();
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={words.generalkaid}
      onSubmit={onSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
      mt={10}
      maxWidth="md"
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <CalenderLocal
            isRTL={isRTL}
            label={words.time}
            value={selectedDate}
            onChange={handleDateChange}
          ></CalenderLocal>
          <TextFieldLocal
            name="maindesc"
            label={isRTL ? '????????????' : 'Reference'}
            value={maindesc}
            onChange={(e: any) => setMaindesc(e.target.value)}
            row={row}
            fullWidth
          />
          <Grid
            style={{
              backgroundColor: '#f4f4f4',
              padding: 15,
              borderRadius: 10,
            }}
            container
            spacing={1}
          >
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <AutoFieldLocal
                    name="debitAcc"
                    title={words.to}
                    words={words}
                    options={debaccounts}
                    value={debitAcc}
                    setSelectValue={setDebitAcc}
                    isRTL={isRTL}
                    fullwidth
                    mb={0}
                  ></AutoFieldLocal>
                </Grid>
                <Grid item xs={4}>
                  <AutoFieldLocal
                    name="creditAcc"
                    title={words.from}
                    words={words}
                    options={cridaccounts}
                    value={creditAcc}
                    setSelectValue={setCreditAcc}
                    isRTL={isRTL}
                    fullwidth
                    refernce={crdRef}
                    mb={0}
                  ></AutoFieldLocal>
                </Grid>
                <Grid item xs={4}>
                  <TextFieldLocal
                    required
                    name="amount"
                    label={words.amount}
                    value={amount}
                    onChange={(e: any) => setAmount(Number(e.target.value))}
                    row={row}
                    type="number"
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextFieldLocal
                    name="desc"
                    label={words.description}
                    value={desc}
                    onChange={(e: any) => setDesc(e.target.value)}
                    row={row}
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Fab
                    style={{ marginLeft: 10, marginTop: 7 }}
                    color="primary"
                    size="small"
                    onClick={addItemToList}
                    title="Create new row"
                  >
                    <AddIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Grid>
            <KaidsTable
              rows={itemsList}
              editItem={editItemInList}
              removeItem={removeItemFromList}
              isRTL={isRTL}
              words={words}
              user={user}
              accounts={accounts}
            ></KaidsTable>
            {loading && <LoadingInline></LoadingInline>}
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupFinanceAll;
