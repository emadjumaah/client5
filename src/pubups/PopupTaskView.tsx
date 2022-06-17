/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  Button,
  colors,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/client';
import { moneyFormat } from '../Shared/colorFormat';
import PopupTaskAppointment from './PopupTaskAppointment';
import _ from 'lodash';
import PopupTaskInvoice from './PopupTaskInvoice';
import getTaskItems from '../graphql/query/getTaskItems';
import { taskManamentTabs } from '../constants/rrule';
import EventsCustomer from '../Shared/EventsCustomer';
import InvoicesCustomer from '../Shared/InvoicesCustomer';
import ReceiptCustomer from '../Shared/ReceiptCustomer';
import ExpensesCustomer from '../Shared/ExpensesCustomer';
import ProjectsCustomer from '../Shared/ProjectsCustomer';
import TasksCustomer from '../Shared/TasksCustomer';
import getObjectEvents from '../graphql/query/getObjectEvents';
import {
  createEvent,
  getCustomers,
  getDepartments,
  getEmployees,
  getOperationItems,
  getProjects,
  getResourses,
} from '../graphql';
import getTasks from '../graphql/query/getTasks';
import {
  getReadyCloseEventData,
  getReadyEventData,
  getTaskTimeAmountData,
} from '../common/helpers';
import { ContractPrint } from '../print';
import { useReactToPrint } from 'react-to-print';
import KaidsCustomer from '../Shared/KaidsCustomer';
import { useTemplate } from '../hooks';
import PopupCloseDate from './PopupCloseDate';
import PercentChartTask from '../components/charts/PercentChartTask';
import useWindowDimensions from '../hooks/useWindowDimensions';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupTaskView = ({
  open,
  onClose,
  item,
  tasks,
  isNew,
  resourses,
  employees,
  departments,
  customers,
  servicesproducts,
  products,
  theme,
  company,
  stopTask,
}: any) => {
  const classes = useStyles();
  const [openEvent, setOpenEvent] = useState<any>(false);
  const [event, setEvent] = useState<any>(null);
  const [row, setRow] = useState(item);
  const [value, setValue] = React.useState(2);

  const [start, setStart]: any = useState(null);
  const [end, setEnd]: any = useState(null);
  const [custvalue, setCustvalue] = useState(null);
  const [resovalue, setResovalue] = useState(null);
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);
  const [closeloading, setCloseloading] = useState<any>(null);

  const [openCloseDate, setOpenCloseDate] = useState<any>(false);

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
      setStart(row?.start);
      setEnd(row?.end);
      if (resId) {
        const empl = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(empl);
      }
      if (custId) {
        const cust = customers.filter((cu: any) => cu._id === custId)[0];
        setCustvalue(cust);
      }
    }
  }, [row]);

  const [openInvoice, setOpenInvoice] = useState(false);
  const [itemsList, setItemsList] = useState<any>([]);
  const amount = row?.amount ? row.amount : 0;
  const totalinvoiced = row?.totalinvoiced ? row.totalinvoiced : 0;
  const totalDiscount = row?.totalDiscount ? row.totalDiscount : 0;
  const totalpaid = row?.totalpaid ? row.totalpaid : 0;
  const toatlExpenses = row?.toatlExpenses ? row.toatlExpenses : 0;
  const progress = row?.progress ? row.progress : 0;
  const totalkaidsdebit = row?.totalkaidsdebit ? row.totalkaidsdebit : 0;
  const totalKaidscredit = row?.totalKaidscredit ? row.totalKaidscredit : 0;
  const totalkaids = totalkaidsdebit - totalKaidscredit;
  const income = totalinvoiced - toatlExpenses - totalDiscount - totalkaids;
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const refresQuery = {
    refetchQueries: [
      {
        query: getObjectEvents,
        variables: { taskId: row?.id },
      },
      {
        query: getTasks,
      },
      {
        query: getCustomers,
      },
      {
        query: getEmployees,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getDepartments,
        variables: { isRTL, depType: 1 },
      },
      {
        query: getResourses,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getProjects,
      },
    ],
  };

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

  const [addEvent] = useMutation(createEvent, refresQuery);

  const [getItems, itemsData]: any = useLazyQuery(getTaskItems, {
    fetchPolicy: 'cache-and-network',
  });

  const addNewEvent = async () => {
    if (!event) return;
    setLoading(true);
    const variables = getReadyEventData(
      event,
      row,
      eventItemsData,
      servicesproducts
    );
    if (!variables) {
      setLoading(false);
      return;
    }
    await addEvent({ variables });
    setLoading(false);
  };
  const toCloseTask = async (time: any) => {
    if (!event) return;
    setCloseloading(true);
    const data = eventsData?.data?.['getObjectEvents']?.data;
    const events = data || [];

    const fevents = events.filter(
      (ev: any) => new Date(ev.startDate) < new Date(time)
    );
    const sum = _.sumBy(fevents, 'amount');
    const days = getTaskTimeAmountData(row, time);

    const amount = days?.amountnow - sum;
    const evdata = getReadyCloseEventData(
      event,
      row,
      amount,
      eventItemsData,
      servicesproducts,
      time
    );
    await stopTask({
      variables: {
        id: row.id,
        time,
        event: JSON.stringify(evdata),
      },
    });
    setCloseloading(false);
  };

  useEffect(() => {
    if (open) {
      const items = itemsData?.data?.['getTaskItems']?.data || [];
      if (items && items.length > 0) {
        const ids = items.map((it: any) => it.itemId);
        const servlist = servicesproducts.filter((ser: any) =>
          ids.includes(ser._id)
        );

        const itemsWqtyprice = items.map((item: any, index: any) => {
          const {
            categoryId,
            categoryName,
            categoryNameAr,
            departmentId,
            departmentName,
            departmentNameAr,
            departmentColor,
            employeeId,
            employeeName,
            employeeNameAr,
            employeeColor,
            resourseId,
            resourseName,
            resourseNameAr,
            resourseColor,
          } = item;
          const serv = servlist.filter((se: any) => se._id === item.itemId)[0];
          return {
            ...serv,
            categoryId,
            categoryName,
            categoryNameAr,
            departmentId,
            departmentName,
            departmentNameAr,
            departmentColor,
            employeeId,
            employeeName,
            employeeNameAr,
            employeeColor,
            resourseId,
            resourseName,
            resourseNameAr,
            resourseColor,
            index,
            itemprice: item.itemPrice,
            itemqty: item.qty,
            itemtotal: item.total,
            // itemtotalcost: item.qty * serv.cost,
          };
        });
        const finalItems = _(itemsWqtyprice)
          .groupBy('_id')
          .map((array) => ({
            _id: array[0]._id,
            name: array[0].name,
            nameAr: array[0].nameAr,
            categoryId: array[0].categoryId,
            categoryName: array[0].categoryName,
            categoryNameAr: array[0].categoryNameAr,
            departmentId: array[0].departmentId,
            departmentName: array[0].departmentName,
            departmentNameAr: array[0].departmentNameAr,
            departmentColor: array[0].departmentColor,
            employeeId: array[0].employeeId,
            employeeName: array[0].employeeName,
            employeeNameAr: array[0].employeeNameAr,
            employeeColor: array[0].employeeColor,
            autoNo: array[0].autoNo,
            docNo: array[0].docNo,
            cost: array[0].cost,
            itemType: array[0].itemType,
            index: array[0].index,
            itemprice: array[0].itemprice,
            itemqty: _.sumBy(array, 'itemqty'),
            itemtotal: _.sumBy(array, 'itemtotal'),
          }))
          .orderBy('index')
          .value();
        setItemsList(finalItems);
      }
    }
  }, [itemsData, open]);

  useEffect(() => {
    if (row && row._id) {
      const variables = { taskId: row.id };
      getItems({ variables });
    }
  }, [row]);
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
  const viewtotal = amount;
  const title = `${tempwords?.task} : ${row?.title}`;
  const salesColor = theme.palette.primary.light;
  const eventColor = theme.palette.secondary.main;

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForm}
      title={title}
      onSubmit={() => null}
      theme={theme}
      alrt={{}}
      mt={10}
      maxWidth={isNew ? 'lg' : 'xl'}
      fullWidth
      preventclose
      onlyclose
      print={!isNew ? handleReactPrint : undefined}
      mb={10}
    >
      <>
        <Grid container spacing={0}>
          <Grid item xs={11}>
            <Box
              style={{
                backgroundColor: '#f5f5f5',
              }}
            >
              <Box display="flex" style={{}}></Box>
              {row && (
                <Box style={{ marginBottom: 10 }}>
                  <TabPanel value={value} index={0}>
                    <ProjectsCustomer
                      servicesproducts={servicesproducts}
                      products={products}
                      isRTL={isRTL}
                      words={words}
                      theme={theme}
                      company={company}
                      name="taskId"
                      value={row}
                      id={row?._id}
                      width={width}
                      height={height}
                    ></ProjectsCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <TasksCustomer
                      servicesproducts={servicesproducts}
                      products={products}
                      isRTL={isRTL}
                      words={words}
                      theme={theme}
                      company={company}
                      name="taskId"
                      value={row}
                      id={row?._id}
                      width={width}
                      height={height}
                    ></TasksCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <EventsCustomer
                      resourses={resourses}
                      employees={employees}
                      departments={departments}
                      customers={customers}
                      servicesproducts={servicesproducts}
                      products={products}
                      isRTL={isRTL}
                      words={words}
                      theme={theme}
                      isNew={isNew}
                      name="taskId"
                      value={row}
                      id={row?.id}
                      width={width}
                      height={height}
                    ></EventsCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <InvoicesCustomer
                      isRTL={isRTL}
                      words={words}
                      resourses={resourses}
                      employees={employees}
                      departments={departments}
                      company={company}
                      theme={theme}
                      servicesproducts={servicesproducts}
                      products={products}
                      name="taskId"
                      value={row}
                      id={row?.id}
                      width={width}
                      height={height}
                    ></InvoicesCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    <ReceiptCustomer
                      isRTL={isRTL}
                      words={words}
                      theme={theme}
                      name="taskId"
                      value={row}
                      id={row?.id}
                      width={width}
                      height={height}
                    ></ReceiptCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={5}>
                    <ExpensesCustomer
                      isRTL={isRTL}
                      words={words}
                      theme={theme}
                      name="taskId"
                      value={row}
                      id={row?.id}
                      width={width}
                      height={height}
                    ></ExpensesCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={6}>
                    <KaidsCustomer
                      isRTL={isRTL}
                      words={words}
                      theme={theme}
                      name="taskId"
                      value={row}
                      id={row?.id}
                      width={width}
                      height={height}
                    ></KaidsCustomer>
                  </TabPanel>
                  <Box
                    display="flex"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                  >
                    <Box>
                      <Typography style={{ fontSize: 14 }}>
                        {isRTL ? 'الاجمالي' : 'Total'}
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {moneyFormat(viewtotal)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: 14 }}>
                        {isRTL ? 'نسبة الانجاز' : 'Progress'}
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {progress}%
                      </Typography>
                    </Box>
                    <Box display="flex" style={{ flexDirection: 'row' }}>
                      <Box>
                        <Typography style={{ fontSize: 14 }}>
                          {isRTL ? 'الفواتير' : 'Total Invoiced'}
                        </Typography>
                        <Typography
                          style={{ fontWeight: 'bold', fontSize: 14 }}
                        >
                          {moneyFormat(totalinvoiced)}
                        </Typography>
                      </Box>
                      {totalDiscount > 0 && (
                        <Box style={{ marginLeft: 20, marginRight: 20 }}>
                          <Typography style={{ fontSize: 14 }}>
                            {isRTL ? 'الحسومات' : 'Total Discounts'}
                          </Typography>
                          <Typography
                            style={{ fontWeight: 'bold', fontSize: 14 }}
                          >
                            {moneyFormat(totalDiscount)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: 14 }}>
                        {isRTL ? 'المقبوضات' : 'Total Paid'}
                      </Typography>
                      <Typography style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {moneyFormat(totalpaid)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        style={{ fontSize: 14, color: colors.blue[500] }}
                      >
                        {isRTL ? 'المتبقي' : 'Due Payment'}
                      </Typography>{' '}
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          color: colors.blue[500],
                        }}
                      >
                        {moneyFormat(totalinvoiced - totalpaid - totalDiscount)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography style={{ fontSize: 14 }}>
                        {isRTL ? 'المصروفات' : 'Total Expenses'}
                      </Typography>{' '}
                      <Typography style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {moneyFormat(toatlExpenses)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography style={{ fontSize: 14 }}>
                        {isRTL ? 'القيود' : 'Entries'}
                      </Typography>{' '}
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          color: totalkaids < 0 ? colors.red[500] : undefined,
                        }}
                      >
                        {moneyFormat(totalkaids)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        style={{ fontSize: 14, color: colors.green[500] }}
                      >
                        {isRTL ? 'صافي الايراد' : 'Total Income'}
                      </Typography>{' '}
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          color:
                            income < 0 ? colors.red[500] : colors.green[500],
                        }}
                      >
                        {moneyFormat(income)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {row && (
            <Grid item xs={1}>
              <Box style={{ marginTop: 10, marginBottom: 10 }}>
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
              <Box
                style={{
                  backgroundColor: '#f5f5f5',
                  margin: 7,
                  padding: 8,
                  borderRadius: 5,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  {row.title}
                </Typography>
                <Typography
                  variant="subtitle2"
                  style={{ fontWeight: 'bold', marginTop: 10 }}
                >
                  {words.customer}
                </Typography>
                <Typography>
                  {isRTL ? row.customerNameAr : row.customerName}
                </Typography>
                <Typography
                  variant="subtitle2"
                  style={{ fontWeight: 'bold', marginTop: 10 }}
                >
                  {words.employee}
                </Typography>
                <Typography>
                  {isRTL ? row.employeeNameAr : row.employeeName}
                </Typography>
                <Typography
                  variant="subtitle2"
                  style={{ fontWeight: 'bold', marginTop: 10 }}
                >
                  {words.department}
                </Typography>
                <Typography>
                  {isRTL ? row.departmentNameAr : row.departmentName}
                </Typography>
              </Box>
              <Box style={{ padding: 10, marginTop: 20 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => setOpenInvoice(true)}
                >
                  <Typography>{words.newInvoice}</Typography>
                </Button>
              </Box>
              <Box style={{ padding: 10 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  disabled={loading || row.isClosed}
                  onClick={() => addNewEvent()}
                >
                  <Typography>{words.newPeriod}</Typography>
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item xs={11}>
            {daysData && (
              <Box
                display={'flex'}
                style={{
                  flex: 1,
                  backgroundColor: colors.grey[100],
                  marginBottom: 10,
                }}
                borderRadius={10}
              >
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    {daysData?.progress && (
                      <Box style={{ height: 90 }}>
                        <PercentChartTask
                          pricolor={salesColor}
                          seccolor={eventColor}
                          progress={daysData?.progress}
                          height={90}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container spacing={1}>
                      <Grid item xs={3}>
                        <Typography
                          style={{ fontWeight: 'bold', marginTop: 20 }}
                        >
                          {isRTL ? 'عدد الايام' : 'Days'} : {daysData?.days}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        {daysData?.daysnow && (
                          <Typography
                            style={{ fontWeight: 'bold', marginTop: 20 }}
                          >
                            {isRTL ? 'أيام مضت' : 'Spent Days'} :{' '}
                            {daysData?.daysnow}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={3}>
                        {daysData?.amountnow && (
                          <Typography
                            style={{ fontWeight: 'bold', marginTop: 20 }}
                          >
                            {isRTL ? 'القيمة المستحقة' : 'Amount Until Now'} :{' '}
                            {moneyFormat(daysData?.amountnow)}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={3}>
                        <Button
                          variant="contained"
                          fullWidth
                          color="primary"
                          style={{ width: 150, marginTop: 20 }}
                          disabled={
                            closeloading ||
                            row.isClosed ||
                            row?.status === 'لم يبدأ بعد' ||
                            row?.status === 'Not Started'
                          }
                          onClick={() => setOpenCloseDate(true)}
                        >
                          <Typography>
                            {words.shutdown} {tempwords?.task}
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
        {row && (
          <PopupTaskAppointment
            open={openEvent}
            onClose={() => setOpenEvent(false)}
            row={null}
            isNew={true}
            resourses={resourses}
            employees={employees}
            departments={departments}
            customers={customers}
            servicesproducts={servicesproducts}
            theme={theme}
          ></PopupTaskAppointment>
        )}
        {row && (
          <PopupTaskInvoice
            open={openInvoice}
            onClose={() => setOpenInvoice(false)}
            task={row}
            customers={customers}
            services={servicesproducts}
            resourses={resourses}
            employees={employees}
            departments={departments}
            company={company}
            theme={theme}
            items={itemsList}
          ></PopupTaskInvoice>
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
      </>
    </PopupLayout>
  );
};

export default PopupTaskView;
