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
  pcodevalue,
  accvalue,
  optypevalue,
  itemtypevalue,
  itemvalue,
  emplvalue,
  resovalue,
  departvalue,
  projvalue,
  taskvalue,
  custvalue,
  suppvalue,
  words,
  isRTL,
  retypes,
}: any) {
  const [items, setItems] = React.useState(services);
  const [faccounts, setFAccounts] = React.useState(accounts);
  const [emptype, setEmptype] = React.useState([]);
  const [restype, setRestype] = React.useState([]);

  const { tempoptions } = useTemplate();

  useEffect(() => {
    let itms = [];
    const itty = itemtypevalue.map((a: any) => a.value);
    if (itty && itty.length > 0) {
      if (itty.includes(1)) itms = [...itms, ...products];
      if (itty.includes(2)) itms = [...itms, ...services];
      if (itty.includes(10)) itms = [...itms, ...expenseItems];
    }
    setItems(itms);
  }, [itemtypevalue]);

  useEffect(() => {
    if (emptype && emptype.length > 0) {
      const ids = emptype.map((e: any) => e._id);
      const emps = employees.filter((em: any) => ids.includes(em.retypeId));
      setEmplvalue(emps);
    } else {
      setEmplvalue([]);
    }
  }, [emptype]);

  useEffect(() => {
    if (restype && restype.length > 0) {
      const ids = restype.map((e: any) => e._id);
      const ress = resourses.filter((em: any) => ids.includes(em.retypeId));
      setResovalue(ress);
    } else {
      setResovalue([]);
    }
  }, [restype]);

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
  }, [pcodevalue]);

  const handleResetAll = () => {
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

  return (
    <Paper elevation={3} style={{ margin: 10, marginTop: 20 }}>
      <Box>
        <FilterSelectMulti
          options={mainaccounts}
          value={pcodevalue}
          setValue={setPcodevalue}
          words={words}
          isRTL={isRTL}
          name="mainaccounts"
          label={isRTL ? 'الحسابات الرئيسية' : 'Main Accounts'}
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={faccounts}
          value={accvalue}
          setValue={setAccountvalue}
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
          value={optypevalue}
          setValue={setOptypevalue}
          words={words}
          isRTL={isRTL}
          name="documenttype"
          label={isRTL ? 'نوع المستند' : 'Document Types'}
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={itemTypes}
          value={itemtypevalue}
          setValue={setItemtypevalue}
          words={words}
          isRTL={isRTL}
          name="itemtype"
          label={isRTL ? 'نوع البند' : 'Item Type'}
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={items}
          value={itemvalue}
          setValue={setItemvalue}
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
          options={retypes.filter((rt: any) => rt.reType === 1)}
          value={emptype}
          setValue={setEmptype}
          words={words}
          isRTL={isRTL}
          name="emptype"
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={employees}
          value={emplvalue}
          setValue={setEmplvalue}
          words={words}
          isRTL={isRTL}
          name="employee"
          fullwidth
        ></FilterSelectMulti>
        {!tempoptions?.noRes && resourses && resourses.length > 0 && (
          <>
            <FilterSelectMulti
              options={retypes.filter((rt: any) => rt.reType === 2)}
              value={restype}
              setValue={setRestype}
              words={words}
              isRTL={isRTL}
              name="restype"
              fullwidth
            ></FilterSelectMulti>
            <FilterSelectMulti
              options={resourses}
              value={resovalue}
              setValue={setResovalue}
              words={words}
              isRTL={isRTL}
              name="resourse"
              fullwidth
            ></FilterSelectMulti>
          </>
        )}
        <FilterSelectMulti
          options={departments}
          value={departvalue}
          setValue={setDepartvalue}
          words={words}
          isRTL={isRTL}
          name="department"
          fullwidth
        ></FilterSelectMulti>
        {!tempoptions?.noPro && projects && projects.length > 0 && (
          <FilterSelectMulti
            options={projects}
            value={projvalue}
            setValue={setProjvalue}
            words={words}
            isRTL={isRTL}
            name="project"
            fullwidth
          ></FilterSelectMulti>
        )}
        {!tempoptions?.noTsk && tasks && tasks.length > 0 && (
          <FilterSelectMulti
            options={tasks}
            value={taskvalue}
            setValue={setTaskvalue}
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
          value={custvalue}
          setValue={setCustvalue}
          words={words}
          isRTL={isRTL}
          name="customer"
          fullwidth
        ></FilterSelectMulti>
        <FilterSelectMulti
          options={suppliers}
          value={suppvalue}
          setValue={setSuppvalue}
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
        <Button variant="outlined" onClick={handleResetAll} color="primary">
          <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>
            {isRTL ? 'مسح الفلاتر' : 'Reset Filters'}
          </Typography>
        </Button>
      </Box>
    </Paper>
  );
}
