/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Button, colors, Tab, Tabs, Typography } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/client';
import PopupTaskInvoice from './PopupTaskInvoice';
import { taskManamentTabs } from '../constants/rrule';
import EventsCustomer from '../Shared/EventsCustomer';
import InvoicesCustomer from '../Shared/InvoicesCustomer';
import ReceiptCustomer from '../Shared/ReceiptCustomer';
import getObjectEvents from '../graphql/query/getObjectEvents';
import {
  createEvent,
  createExpenses,
  createFinance,
  getExpenses,
  getOperationItems,
} from '../graphql';
import getTasks from '../graphql/query/getTasks';
import { getReadyEventData, getTaskTimeAmountData } from '../common/helpers';
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

const PopupTaskView = ({
  open,
  onClose,
  item,
  tasks,
  isNew,
  theme,
  company,
  stopTask,
}: any) => {
  const classes = useStyles();
  const [event, setEvent] = useState<any>(null);
  const [row, setRow] = useState(item);
  const [value, setValue] = React.useState(0);

  const [custvalue, setCustvalue] = useState(null);
  const [resovalue, setResovalue] = useState(null);
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);
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

  const { tempwords } = useTemplate();
  const { width, height } = useWindowDimensions();

  const daysData = getTaskTimeAmountData(row);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (item?.id && tasks && tasks.length > 0) {
      const opened = tasks.filter((ts: any) => ts.id === item.id)?.[0];
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

  const refresQuery = {
    refetchQueries: [
      {
        query: getObjectEvents,
        variables: {
          taskId: row?.id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      { query: getTasks },
    ],
  };
  const refresReceiptQuery = {
    refetchQueries: [
      {
        query: getReceipts,
        variables: {
          taskId: row?.id,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
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
          opType: 60,
          start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
          end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
        },
      },
      { query: getTasks },
    ],
  };

  const [addFinance] = useMutation(createFinance, refresReceiptQuery);

  const [addExpenses] = useMutation(createExpenses, refresExpensesQuery);

  const [addEvent] = useMutation(createEvent, refresQuery);

  const [getEvents, eventsData]: any = useLazyQuery(getObjectEvents, {
    fetchPolicy: 'cache-and-network',
  });

  const [getEventItems, eventItemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const variables = { taskId: row?.id };
    getEvents({ variables });
  }, [row?.id, row]);

  useEffect(() => {
    const data = eventsData?.data?.['getObjectEvents']?.data;
    const events = data || [];
    if (events?.length > 0) {
      const ev = events[events.length - 1];
      getEventItems({ variables: { opId: ev._id } });
      setEvent(events[events.length - 1]);
    }
  }, [eventsData, item]);

  const addNewEvent = async () => {
    if (!event) return;
    setLoading(true);
    const variables = getReadyEventData(event, row, eventItemsData, services);
    if (!variables) {
      setLoading(false);
      return;
    }
    await addEvent({ variables });
    setLoading(false);
  };
  const toCloseTask = async (time: any) => {
    setCloseloading(true);

    await stopTask({
      variables: {
        id: row.id,
        time,
        del: true,
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
    setEvent(null);
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
                  <Box style={{ marginBottom: 10 }}>
                    <TabPanel value={value} index={0}>
                      <MainCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="taskId"
                        value={row}
                        id={row?.id}
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
                        id={row?.id}
                        name="taskId"
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        value={row}
                        company={company}
                      ></EventsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <InvoicesCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="taskId"
                        id={row?.id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        value={row}
                        company={company}
                      ></InvoicesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      <ReceiptCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="taskId"
                        id={row?.id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        value={row}
                        company={company}
                      ></ReceiptCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <ExpensesCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="taskId"
                        id={row?.id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                        value={row}
                        company={company}
                      ></ExpensesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                      <KaidsCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="taskId"
                        id={row?.id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                      ></KaidsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                      <ReminderCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="taskId"
                        id={row?.id}
                        width={width}
                        height={height}
                        start={start}
                        end={end}
                      ></ReminderCustomer>
                    </TabPanel>
                  </Box>
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

              <Box style={{ padding: 10, marginTop: 50 }}>
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
              <Box style={{ padding: 10 }}>
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
              <Box style={{ padding: 10 }}>
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
              <Box style={{ padding: 10, marginTop: 50 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  disabled={loading || row.isClosed}
                  onClick={() => addNewEvent()}
                >
                  <Typography style={{ fontSize: 14 }}>
                    {words.newPeriod}
                  </Typography>
                </Button>
              </Box>
              <Box style={{ padding: 10 }}>
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
                    {words.shutdown} {tempwords?.task}
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
              // items={itemsList}
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
              name="taskId"
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
              title={`${words.shutdown} ${isRTL ? 'ال' : ''}${tempwords?.task}`}
              minDate={new Date(row.start)}
              maxDate={new Date()}
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
