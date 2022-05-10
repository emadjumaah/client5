/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { dublicateAlert, errorAlert, messageAlert } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Fab } from '@material-ui/core';
import useAccounts from '../hooks/useAccounts';
import { operationTypes } from '../constants';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { CalenderLocal, TextFieldLocal } from '../components';
import { getAppStartEndPeriod } from '../common/time';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import AddIcon from '@material-ui/icons/Add';
import { useLazyQuery } from '@apollo/client';
import getOperationKaids from '../graphql/query/getOperationKaids';
import LoadingInline from '../Shared/LoadingInline';
import { useTemplate } from '../hooks';
import KaidsSingleTable from '../Shared/KaidsSingleTable';
import { GeneralKaidPrint } from '../print/GeneralKaidPrint';
import { useReactToPrint } from 'react-to-print';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

export const kaidlist = (list: any) => {
  return list.map((item: any) => {
    return {
      ...item,
      amountDebit: item.debit,
      amountCredit: item.credit,
      acc: item.accCode,
    };
  });
};

const PopupFinanceAllKaid = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  tasks,
  employees,
  resourses,
  departments,
  projects,
  company,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const [amountDebit, setAmountDebit]: any = React.useState(0);
  const [amountCredit, setAmountCredit]: any = React.useState(0);

  const [kaidsums, setKaidsums]: any = React.useState();
  const [desc, setDesc]: any = React.useState('');

  const [acc, setAcc]: any = React.useState(null);

  const [itemsList, setItemsList] = useState([]);

  const [emplvalue, setEmplvalue] = useState(null);
  const [resovalue, setResovalue] = useState(null);
  const [departvalue, setDepartvalue] = useState(null);
  const [taskvalue, setTaskvalue] = useState(null);
  const [projvalue, setProjvalue] = useState(null);

  const [maindesc, setMaindesc] = useState('');

  const { tempwords, tempoptions } = useTemplate();
  const componentRef: any = useRef();

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const [getItems, itemsData]: any = useLazyQuery(getOperationKaids, {
    fetchPolicy: 'cache-and-network',
  });

  const { accounts } = useAccounts();

  useEffect(() => {
    const items = itemsData?.data?.['getOperationKaids']?.data || [];
    if (items && items.length > 0) {
      const freshlist = kaidlist(items);
      const listwithindex = indexTheList(freshlist);
      setItemsList(listwithindex);
      setLoading(false);
    }
  }, [itemsData]);

  useEffect(() => {
    if (row && row._id) {
      setLoading(true);
      const variables = { opId: row._id };
      getItems({ variables });
      setMaindesc(row.desc);
      handleDateChange(row.time);
    }
  }, [row]);

  useEffect(() => {
    if (taskvalue) {
      const task = tasks.filter((tsk: any) => tsk.id === taskvalue);
      if (task?.projectId) {
        const proj = projects.filter(
          (pro: any) => pro._id === taskvalue?.projectId
        )?.[0];
        setProjvalue(proj);
      }
    } else {
      setProjvalue(null);
    }
  }, [taskvalue]);

  const addItemToList = async () => {
    if (!acc) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب تحديد الحساب' : 'You have to select account'
      );
      return;
    }
    if (amountDebit === 0 && amountCredit === 0) {
      await messageAlert(
        setAlrt,
        isRTL ? 'قيمة القيد مطلوبة' : 'Amount required'
      );
      return;
    }
    const item = {
      time: selectedDate,
      acc: acc.code,
      amountCredit,
      amountDebit,
      desc,
      departmentId: departvalue ? departvalue._id : undefined,
      departmentName: departvalue ? departvalue.name : undefined,
      departmentNameAr: departvalue ? departvalue.nameAr : undefined,
      employeeId: emplvalue ? emplvalue._id : undefined,
      employeeName: emplvalue ? emplvalue.name : undefined,
      employeeNameAr: emplvalue ? emplvalue.nameAr : undefined,
      resourseId: resovalue ? resovalue._id : undefined,
      resourseName: resovalue ? resovalue.name : undefined,
      resourseNameAr: resovalue ? resovalue.nameAr : undefined,
      projectId: projvalue ? projvalue._id : undefined,
      projectName: projvalue ? projvalue.name : undefined,
      projectNameAr: projvalue ? projvalue.nameAr : undefined,
      taskId: taskvalue ? taskvalue.id : null,

      branch: user.branch,
      userId: user._id,
    };
    const newArray = [...itemsList, { ...item, userId: user._id }];
    const listwithindex = indexTheList(newArray);
    setItemsList(listwithindex);
    resetForm();
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
  useEffect(() => {
    getOverallSums();
  }, [itemsList]);
  const getOverallSums = () => {
    const creditlist = itemsList.map((litem: any) => litem.amountCredit);
    const credit = creditlist.reduce((psum: any, a: any) => psum + a, 0);
    const debitlist = itemsList.map((litem: any) => litem.amountDebit);
    const debit = debitlist.reduce((psum: any, a: any) => psum + a, 0);
    setKaidsums({ credit, debit });
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
    if (!itemsList || itemsList.length === 0) {
      await messageAlert(
        setAlrt,
        isRTL ? 'لا يوجد قيود لحفظها' : 'No Items to be saved'
      );
      return;
    }
    if (!kaidsums?.credit || kaidsums?.credit !== kaidsums?.debit) {
      await messageAlert(
        setAlrt,
        isRTL ? 'يجب ان يكون الطرفين متساويين' : 'The Document must be balanced'
      );
      return;
    }
    setSaving(true);

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      opType: operationTypes.kaid,
      time: selectedDate,
      items: JSON.stringify(itemsList),
      desc: maindesc,
      branch: user.branch,
      userId: user._id,
      amount: kaidsums?.credit,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
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
    setAmountCredit(0);
    setAmountDebit(0);
    setDesc('');
    setAcc(null);
    setEmplvalue(null);
    setResovalue(null);
    setDepartvalue(null);
    setTaskvalue(null);
    setProjvalue(null);
    setSaving(false);
  };
  const resetAll = () => {
    resetForm();
    setItemsList([]);
    setMaindesc('');
  };
  const closeModal = () => {
    resetAll();
    onClose();
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const printData = {
    kaidNo: row?.docNo,
    time: selectedDate,
    items: itemsList,
    ...row,
  };

  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Entry #${row?.docNo}`,
    removeAfterPrint: true,
  });
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={words.generalkaid}
      onSubmit={onSubmit}
      theme={theme}
      alrt={alrt}
      print={handleReactPrint}
      saving={saving}
      mt={10}
      maxWidth="lg"
    >
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <CalenderLocal
            isRTL={isRTL}
            label={words.time}
            value={selectedDate}
            onChange={handleDateChange}
          ></CalenderLocal>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={7} style={{ marginTop: 10 }}>
          <TextFieldLocal
            name="maindesc"
            label={isRTL ? 'العنوان' : 'Title'}
            value={maindesc}
            onChange={(e: any) => setMaindesc(e.target.value)}
            row={row}
            fullWidth
          />
        </Grid>
        <Grid item xs={11}>
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
                <Grid item xs={6}>
                  <AutoFieldLocal
                    name="acc"
                    title={words.account}
                    words={words}
                    options={accounts}
                    value={acc}
                    setSelectValue={setAcc}
                    isRTL={isRTL}
                    fullwidth
                    mb={0}
                  ></AutoFieldLocal>
                </Grid>

                <Grid item xs={3}>
                  <TextFieldLocal
                    required
                    name="amountDebit"
                    label={words.amountDebit}
                    value={amountDebit}
                    onChange={(e: any) => {
                      setAmountDebit(Number(e.target.value));
                      setAmountCredit(0);
                    }}
                    row={row}
                    type="number"
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextFieldLocal
                    required
                    name="amountCredit"
                    label={words.amountCredit}
                    value={amountCredit}
                    onChange={(e: any) => {
                      setAmountCredit(Number(e.target.value));
                      setAmountDebit(0);
                    }}
                    row={row}
                    type="number"
                    fullWidth
                    mb={0}
                  />
                </Grid>
                <Grid item xs={3}>
                  <AutoFieldLocal
                    name="task"
                    title={tempwords?.task}
                    words={words}
                    options={tasks}
                    value={taskvalue}
                    setSelectValue={setTaskvalue}
                    isRTL={isRTL}
                    fullWidth
                  ></AutoFieldLocal>
                </Grid>

                {!tempoptions?.noRes && (
                  <Grid item xs={3}>
                    <AutoFieldLocal
                      name="resourse"
                      title={tempwords?.resourse}
                      words={words}
                      options={resourses}
                      value={resovalue}
                      setSelectValue={setResovalue}
                      isRTL={isRTL}
                      fullWidth
                    ></AutoFieldLocal>
                  </Grid>
                )}
                <Grid item xs={3}>
                  <AutoFieldLocal
                    name="department"
                    title={tempwords?.department}
                    words={words}
                    options={departments}
                    value={departvalue}
                    setSelectValue={setDepartvalue}
                    isRTL={isRTL}
                  ></AutoFieldLocal>
                </Grid>
                {!tempoptions?.noEmp && (
                  <Grid item xs={3}>
                    <AutoFieldLocal
                      name="employee"
                      title={tempwords?.employee}
                      words={words}
                      options={employees}
                      value={emplvalue}
                      setSelectValue={setEmplvalue}
                      isRTL={isRTL}
                      fullWidth
                    ></AutoFieldLocal>
                  </Grid>
                )}
                <Grid item xs={10}>
                  <TextFieldLocal
                    name="desc"
                    label={words.description}
                    value={desc}
                    onChange={(e: any) => setDesc(e.target.value)}
                    row={row}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
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
            <KaidsSingleTable
              rows={itemsList}
              editItem={editItemInList}
              removeItem={removeItemFromList}
              isRTL={isRTL}
              words={words}
              user={user}
              accounts={accounts}
            ></KaidsSingleTable>
            {loading && <LoadingInline></LoadingInline>}
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Box>
                {words.amountDebit}: {kaidsums?.debit}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                {words.amountCredit}: {kaidsums?.credit}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>{kaidsums?.debit - kaidsums?.credit}</Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        <Box>
          <div style={{ display: 'none' }}>
            <GeneralKaidPrint
              company={company}
              user={user}
              printData={printData}
              ref={componentRef}
              isRTL={isRTL}
              tasks={tasks}
            />
          </div>
        </Box>
      </Grid>
    </PopupLayout>
  );
};

export default PopupFinanceAllKaid;
