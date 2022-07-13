/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import FilterSelectMulti from './FilterSelectMulti';
import { useTemplate } from '../hooks';
import { documentTypes } from '../constants/reports';
import { itemTypes } from '../constants/datatypes';

export default function KaidReportFilter({
  mainaccounts,
  accounts,
  services,
  products,
  expenseItems,
  departments,
  setDepartvalue,
  employees,
  setEmplvalue,
  resourses,
  setResovalue,
  projects,
  setProjvalue,
  customers,
  setCustvalue,
  suppliers,
  setSuppvalue,
  tasks,
  setTaskvalue,
  setOptypevalue,
  setItemtypevalue,
  setItemvalue,
  setAccountvalue,
  setPcodevalue,
  words,
  isRTL,
}: any) {
  const [items, setItems] = React.useState(services);
  const [faccounts, setFAccounts] = React.useState(accounts);
  const [resovalueLocal, setResovalueLocal] = React.useState([]);
  const [emplvalueLocal, setEmplvalueLocal] = React.useState([]);
  const [departvalueLocal, setDepartvalueLocal] = React.useState([]);
  const [projvalueLocal, setProjvalueLocal] = React.useState([]);
  const [custvalueLocal, setCustvalueLocal] = React.useState([]);
  const [suppvalueLocal, setSuppvalueLocal] = React.useState([]);
  const [taskvalueLocal, setTaskvalueLocal] = React.useState([]);
  const [optypevalueLocal, setOptypevalueLocal] = React.useState([]);
  const [itemtypevalueLocal, setItemtypevalueLocal] = React.useState([]);
  const [itemvalueLocal, setItemvalueLocal] = React.useState([]);
  const [accountvalueLocal, setAccountvalueLocal] = React.useState([]);
  const [pcodevalueLocal, setPcodevalueLocal] = React.useState([]);

  const { tempoptions } = useTemplate();

  useEffect(() => {
    let itms = [];
    const itty = itemtypevalueLocal.map((a: any) => a.value);
    if (itty && itty.length > 0) {
      if (itty.includes(1)) itms = [...itms, ...products];
      if (itty.includes(2)) itms = [...itms, ...services];
      if (itty.includes(10)) itms = [...itms, ...expenseItems];
    }
    setItems(itms);
  }, [itemtypevalueLocal]);

  useEffect(() => {
    const pcodes = mainaccounts.map((a: any) => a.code);
    if (pcodes && pcodes.length > 0) {
      const faccounts = accounts.filter((acc: any) =>
        pcodes.includes(acc.parentcode)
      );
      setFAccounts(faccounts);
    } else {
      setFAccounts(accounts);
    }
  }, [pcodevalueLocal]);

  const reset = () => {
    setResovalueLocal([]);
    setEmplvalueLocal([]);
    setDepartvalueLocal([]);
    setProjvalueLocal([]);
    setCustvalueLocal([]);
    setSuppvalueLocal([]);
    setTaskvalueLocal([]);
    setOptypevalueLocal([]);
    setItemtypevalueLocal([]);
    setItemvalueLocal([]);
    setAccountvalueLocal([]);
    setPcodevalueLocal([]);
  };

  const handleResetAll = () => {
    reset();
    setProjvalue([]);
    setTaskvalue([]);
    setEmplvalue([]);
    setResovalue([]);
    setDepartvalue([]);
    setCustvalue([]);
    setSuppvalue([]);
    setOptypevalue([]);
    setItemtypevalue([]);
    setItemvalue([]);
    setAccountvalue([]);
    setPcodevalue([]);
  };

  const onSubmit = () => {
    setProjvalue(projvalueLocal);
    setTaskvalue(taskvalueLocal);
    setEmplvalue(emplvalueLocal);
    setResovalue(resovalueLocal);
    setDepartvalue(departvalueLocal);
    setCustvalue(custvalueLocal);
    setSuppvalue(suppvalueLocal);
    setOptypevalue(optypevalueLocal);
    setItemtypevalue(itemtypevalueLocal);
    setItemvalue(itemvalueLocal);
    setAccountvalue(accountvalueLocal);
    setPcodevalue(pcodevalueLocal);
  };

  return (
    <Paper elevation={3} style={{ margin: 10, marginTop: 20 }}>
      <Box>
        <FilterSelectMulti
          options={mainaccounts}
          value={pcodevalueLocal}
          setValue={setPcodevalueLocal}
          words={words}
          isRTL={isRTL}
          name="account"
          label={isRTL ? 'الحسابات الرئيسية' : 'Main Accounts'}
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={faccounts}
          value={accountvalueLocal}
          setValue={setAccountvalueLocal}
          words={words}
          isRTL={isRTL}
          name="account"
          label={isRTL ? 'الحسابات الفرعية' : 'Accounts'}
          fullwidth
        ></FilterSelectMulti>
        <Box
          style={{ height: 20, width: '100%', backgroundColor: '#eee' }}
        ></Box>
        <FilterSelectMulti
          options={documentTypes.filter((dt: any) => dt.id > 2)}
          value={optypevalueLocal}
          setValue={setOptypevalueLocal}
          words={words}
          isRTL={isRTL}
          name="type"
          label={isRTL ? 'نوع المستند' : 'Document Types'}
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={itemTypes}
          value={itemtypevalueLocal}
          setValue={setItemtypevalueLocal}
          words={words}
          isRTL={isRTL}
          name="type"
          label={isRTL ? 'نوع البند' : 'Item Type'}
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={items}
          value={itemvalueLocal}
          setValue={setItemvalueLocal}
          words={words}
          isRTL={isRTL}
          name="product"
          label={isRTL ? 'البنود' : 'Items'}
          fullwidth
        ></FilterSelectMulti>
        <Box
          style={{ height: 20, width: '100%', backgroundColor: '#eee' }}
        ></Box>
        <FilterSelectMulti
          options={employees}
          value={emplvalueLocal}
          setValue={setEmplvalueLocal}
          words={words}
          isRTL={isRTL}
          name="employee"
          fullwidth
        ></FilterSelectMulti>
        {!tempoptions?.noRes && resourses && resourses.length > 0 && (
          <FilterSelectMulti
            options={resourses}
            value={resovalueLocal}
            setValue={setResovalueLocal}
            words={words}
            isRTL={isRTL}
            name="resourse"
            fullwidth
          ></FilterSelectMulti>
        )}
        <FilterSelectMulti
          options={departments}
          value={departvalueLocal}
          setValue={setDepartvalueLocal}
          words={words}
          isRTL={isRTL}
          name="department"
          fullwidth
        ></FilterSelectMulti>
        {!tempoptions?.noPro && projects && projects.length > 0 && (
          <FilterSelectMulti
            options={projects}
            value={projvalueLocal}
            setValue={setProjvalueLocal}
            words={words}
            isRTL={isRTL}
            name="project"
            fullwidth
          ></FilterSelectMulti>
        )}
        {!tempoptions?.noTsk && tasks && tasks.length > 0 && (
          <FilterSelectMulti
            options={tasks}
            value={taskvalueLocal}
            setValue={setTaskvalueLocal}
            words={words}
            isRTL={isRTL}
            name="task"
            fullwidth
          ></FilterSelectMulti>
        )}
        <Box
          style={{ height: 20, width: '100%', backgroundColor: '#eee' }}
        ></Box>
        <FilterSelectMulti
          options={customers}
          value={custvalueLocal}
          setValue={setCustvalueLocal}
          words={words}
          isRTL={isRTL}
          name="customer"
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={suppliers}
          value={suppvalueLocal}
          setValue={setSuppvalueLocal}
          words={words}
          isRTL={isRTL}
          name="supplier"
          fullwidth
        ></FilterSelectMulti>
      </Box>
      <Box
        style={{
          display: 'flex',
          flex: 1,
          height: 70,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 15,
        }}
      >
        <Button
          style={{ width: 80, height: 36 }}
          variant="contained"
          onClick={onSubmit}
          color="primary"
        >
          <Typography>{isRTL ? 'تطبيق' : 'Submit'}</Typography>
        </Button>
        <Button
          style={{ width: 80, height: 36 }}
          variant="contained"
          onClick={handleResetAll}
          color="primary"
        >
          <Typography>{isRTL ? 'الغاء' : 'Cancel'}</Typography>
        </Button>
      </Box>
    </Paper>
  );
}
