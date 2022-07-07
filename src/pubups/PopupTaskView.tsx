/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  Button,
  colors,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import PopupTaskInvoice from './PopupTaskInvoice';
import { taskManamentTabs } from '../constants/rrule';
import EventsCustomer from '../Shared/EventsCustomer';
import InvoicesCustomer from '../Shared/InvoicesCustomer';
import ReceiptCustomer from '../Shared/ReceiptCustomer';
import { createExpenses, createFinance, getExpenses } from '../graphql';
import getTasks from '../graphql/query/getTasks';
import { getTaskTimeAmountData } from '../common/helpers';
import { ContractPrint } from '../print';
import { useReactToPrint } from 'react-to-print';
import KaidsCustomer from '../Shared/KaidsCustomer';
import {
  useCustomers,
  useExpenseItems,
  useServices,
  useTemplate,
} from '../hooks';
import PopupCloseDate from './PopupCloseDate';
import useWindowDimensions from '../hooks/useWindowDimensions';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
import { TabPanel, useStyles, a11yProps } from '../Shared/TabPanel';
import ReminderCustomer from '../Shared/ReminderCustomer';
import MainCustomer from '../Shared/MainCustomer';
import PopupReceipt from './PopupReceipt';
import getReceipts from '../graphql/query/getReceipts';
import ExpensesCustomer from '../Shared/ExpensesCustomer';
import PopupExpensesDoc from './PopupExpensesDoc';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import InvoicesSupplier from '../Shared/InvoicesSupplier';
import PaymentSupplier from '../Shared/PaymentSupplier';
import ExpensesProdCustomer from '../Shared/ExpensesProdCustomer';
import getGereralCalculation from '../graphql/query/getGereralCalculation';

const PopupTaskView = ({
  open,
  onClose,
  item,
  tasks,
  isNew,
  theme,
  company,
  stopTask,
  mstart,
  mend,
}: any) => {
  const classes = useStyles();
  const [row, setRow] = useState(item);
  const [value, setValue] = React.useState(0);
  const [del, setDel] = React.useState(true);

  const [custvalue, setCustvalue] = useState(null);
  const [resovalue, setResovalue] = useState(null);
  const [info, setInfo] = useState<any>(null);
  const [closeloading, setCloseloading] = useState<any>(null);

  const [openCloseDate, setOpenCloseDate] = useState<any>(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [openExpenses, setOpenExpenses] = useState(false);

  const [start, setStart]: any = useState(null);
  const [end, setEnd]: any = useState(null);
  const [currentViewName, setCurrentViewName] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const currentViewNameChange = (e: any) => {
    setCurrentViewName(e.target.value);
  };
  const currentDateChange = (curDate: any) => {
    setCurrentDate(curDate);
  };

  const endDateChange = (curDate: any) => {
    setEndDate(curDate);
  };

  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();
  const { customers } = useCustomers();
  const { expenseItems } = useExpenseItems();

  const { width, height } = useWindowDimensions();
  const { tempoptions, tempwords } = useTemplate();

  const daysData = getTaskTimeAmountData(row);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (item?._id && tasks && tasks.length > 0) {
      const opened = tasks.filter((ts: any) => ts._id === item._id)?.[0];
      setRow(opened);
    }
  }, [tasks]);

  useEffect(() => {
    if (row && row._id) {
      const custId = row.customerId;
      const resId = row.resourseId;
      if (row?.info) {
        setInfo(JSON.parse(row?.info));
      }
      // setStart(row?.start);
      // setEnd(row?.end);
      if (resId) {
        const empl = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(empl);
      }
      if (custId) {
        const cust = customers.filter((cu: any) => cu._id === custId)[0];
        setCustvalue(cust);
      }
    }
  }, [row, customers, resourses]);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const refresReceiptQuery = {
    refetchQueries: [
      {
        query: getReceipts,
        variables: {
          contractId: row?._id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getGereralCalculation,
        variables: {
          contractId: row?._id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getTasks,
        variables: {
          contractId: row?._id,
          start: mstart ? new Date(mstart).setHours(0, 0, 0, 0) : undefined,
          end: mend ? new Date(mend).setHours(23, 59, 59, 999) : undefined,
        },
      },
      { query: getTasks },
    ],
  };
  const refresExpensesQuery = {
    refetchQueries: [
      {
        query: getExpenses,
        variables: {
          contractId: row?._id,
          opType: 60,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getGereralCalculation,
        variables: {
          contractId: row?._id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getTasks,
        variables: {
          contractId: row?._id,
          start: mstart ? new Date(mstart).setHours(0, 0, 0, 0) : undefined,
          end: mend ? new Date(mend).setHours(23, 59, 59, 999) : undefined,
        },
      },

      { query: getTasks },
    ],
  };

  const [addFinance] = useMutation(createFinance, refresReceiptQuery);

  const [addExpenses] = useMutation(createExpenses, refresExpensesQuery);

  const toCloseTask = async (time: any) => {
    setCloseloading(true);

    await stopTask({
      variables: {
        _id: row._id,
        time,
        del,
      },
    });
    setCloseloading(false);
  };

  const printData = {
    ...row,
    no: row?.docNo,
    start,
    end,
    resovalue,
    custvalue,
    info,
    isRTL: isRTL,
  };

  const componentRef: any = useRef();
  const handleReactPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Contract #${row?.docNo}`,
    removeAfterPrint: true,
  });

  const resetAllForms = () => {
    setValue(0);
  };

  const onCloseForm = () => {
    resetAllForms();
    onClose();
  };
  const title = `${tempwords?.task} : ${row?.title}`;
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={() => null}
      theme={theme}
      alrt={{}}
      maxWidth={'xl'}
      print={
        !isNew && [4, 5, 7, 8].includes(company?.tempId)
          ? handleReactPrint
          : undefined
      }
      mb={0}
      mt={0}
      onlyclose
      preventclose
      canceltitle={isRTL ? 'اغلاق' : 'close'}
    >
      <Box>
        <Box display="flex" style={{ backgroundColor: '#fff', height: 50 }}>
          <DateNavigatorReports
            setStart={setStart}
            setEnd={setEnd}
            currentDate={currentDate}
            currentDateChange={currentDateChange}
            currentViewName={currentViewName}
            currentViewNameChange={currentViewNameChange}
            endDate={endDate}
            endDateChange={endDateChange}
            views={[1, 7, 30, 365, 1000]}
            isRTL={isRTL}
            words={words}
            theme={theme}
          ></DateNavigatorReports>
        </Box>
        <Box style={{ display: 'flex', marginTop: 0 }}>
          <Grid container spacing={0} style={{ width: width - 300 }}>
            <Grid item xs={12}>
              <Box
                style={{
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Box display="flex" style={{}}></Box>
                {row && (
                  <Paper
                    elevation={0}
                    style={{ marginBottom: 10, backgroundColor: '#f5f5f5' }}
                  >
                    <TabPanel value={value} index={0}>
                      <MainCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        closeloading={closeloading}
                        setOpenCloseDate={setOpenCloseDate}
                        daysData={daysData}
                      ></MainCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <EventsCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        id={row?._id}
                        name="contractId"
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        value={row}
                        company={company}
                        tempoptions={tempoptions}
                      ></EventsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <InvoicesCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        value={row}
                        company={company}
                        tempoptions={tempoptions}
                      ></InvoicesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      <ReceiptCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        value={row}
                        company={company}
                      ></ReceiptCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <InvoicesSupplier
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        value={row}
                        company={company}
                        tempoptions={tempoptions}
                      ></InvoicesSupplier>
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                      <PaymentSupplier
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        value={row}
                        company={company}
                      ></PaymentSupplier>
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                      <ExpensesCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        value={row}
                        company={company}
                        tempoptions={tempoptions}
                        tempwords={tempwords}
                      ></ExpensesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={7}>
                      <ExpensesProdCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        value={row}
                        company={company}
                        tempoptions={tempoptions}
                        tempwords={tempwords}
                      ></ExpensesProdCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={8}>
                      <KaidsCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        tempoptions={tempoptions}
                      ></KaidsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={9}>
                      <ReminderCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="contractId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        mstart={mstart}
                        mend={mend}
                        tempoptions={tempoptions}
                      ></ReminderCustomer>
                    </TabPanel>
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
          {row && (
            <Box style={{ width: 200 }}>
              <Box>
                <Tabs
                  orientation="vertical"
                  value={value}
                  onChange={handleChange}
                  aria-label="items"
                  className={classes.tabs}
                  variant="fullWidth"
                  TabIndicatorProps={{ style: { width: 3 } }}
                  textColor="primary"
                  centered
                >
                  {taskManamentTabs.map((item: any) => {
                    if (item.hide) {
                      return <div></div>;
                    }
                    return (
                      <Tab
                        style={{
                          backgroundColor:
                            value === item.id ? '#f5f5f5' : undefined,
                        }}
                        label={
                          <Typography
                            style={{ fontWeight: 'bold', fontSize: 13 }}
                          >
                            {isRTL ? item.nameAr : item.name}
                          </Typography>
                        }
                        {...a11yProps(item.id)}
                      />
                    );
                  })}
                </Tabs>
              </Box>

              <Box style={{ paddingLeft: 10, paddingRight: 10, marginTop: 30 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => setOpenInvoice(true)}
                  style={{ backgroundColor: colors.blue[500] }}
                >
                  <Typography style={{ fontSize: 14 }}>
                    {words.newInvoice}
                  </Typography>
                </Button>
              </Box>
              <Box style={{ paddingLeft: 10, paddingRight: 10, marginTop: 15 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  style={{ backgroundColor: colors.green[500] }}
                  onClick={() => setOpenReceipt(true)}
                >
                  <Typography style={{ fontSize: 14 }}>
                    {isRTL ? 'اضافة سند قبض' : 'New Receipt'}
                  </Typography>
                </Button>
              </Box>
              <Box style={{ paddingLeft: 10, paddingRight: 10, marginTop: 15 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => setOpenExpenses(true)}
                  style={{ backgroundColor: colors.red[500] }}
                >
                  <Typography style={{ fontSize: 14 }}>
                    {isRTL ? 'اضافة مصروف' : 'New Expenses'}
                  </Typography>
                </Button>
              </Box>
              <Box style={{ paddingLeft: 10, paddingRight: 10, marginTop: 15 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  disabled={
                    closeloading ||
                    row.isClosed ||
                    row?.status === 'لم يبدأ بعد' ||
                    row?.status === 'Not Started'
                  }
                  onClick={() => setOpenCloseDate(true)}
                >
                  <Typography style={{ fontSize: 14 }}>
                    {words.shutdown}
                  </Typography>
                </Button>
              </Box>
            </Box>
          )}
          {row && (
            <PopupTaskInvoice
              open={openInvoice}
              onClose={() => setOpenInvoice(false)}
              task={row}
              customers={customers}
              services={services}
              resourses={resourses}
              employees={employees}
              departments={departments}
              company={company}
              theme={theme}
              mstart={start}
              mend={end}
            ></PopupTaskInvoice>
          )}
          {row && (
            <PopupReceipt
              open={openReceipt}
              onClose={() => setOpenReceipt(false)}
              task={row}
              isNew={true}
              addAction={addFinance}
              editAction={() => null}
              theme={theme}
              company={company}
              name="customerId"
              value={custvalue}
            ></PopupReceipt>
          )}
          {row && (
            <PopupExpensesDoc
              open={openExpenses}
              onClose={() => setOpenExpenses(false)}
              task={row}
              isNew={true}
              addAction={addExpenses}
              editAction={() => null}
              resourses={resourses}
              employees={employees}
              departments={departments}
              servicesproducts={expenseItems}
              theme={theme}
              company={company}
              name="contractId"
              value={row}
            ></PopupExpensesDoc>
          )}
          {row && (
            <PopupCloseDate
              open={openCloseDate}
              onClose={() => setOpenCloseDate(false)}
              toCloseTask={toCloseTask}
              theme={theme}
              isRTL={isRTL}
              title={`${words.shutdown} ${tempwords?.task}`}
              minDate={new Date(row.start)}
              maxDate={new Date()}
              del={del}
              setDel={setDel}
              tasktype={row?.tasktype}
            ></PopupCloseDate>
          )}
          <Box>
            <div style={{ display: 'none' }}>
              <ContractPrint
                company={company}
                user={user}
                printData={printData}
                ref={componentRef}
              />
            </div>
          </Box>
        </Box>
      </Box>
    </PopupLayout>
  );
};

export default PopupTaskView;
