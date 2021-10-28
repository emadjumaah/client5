/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
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

import { useLazyQuery } from '@apollo/client';
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
    borderRight: `1px solid ${theme.palette.divider}`,
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
  theme,
  isEditor,
  company,
}: any) => {
  const classes = useStyles();

  const [openEvent, setOpenEvent] = useState<any>(false);
  const [evList, setEvList] = useState<any>([]);
  const [total, setTotal] = useState<any>(null);
  const [row, setRow] = useState(item);
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (item?.id && tasks && tasks.length > 0) {
      const opened = tasks.filter((ts: any) => ts.id === item.id)?.[0];
      setRow(opened);
    }
  }, [tasks]);

  const [openInvoice, setOpenInvoice] = useState(false);
  const [itemsList, setItemsList] = useState<any>([]);
  const amount = row?.amount ? row.amount : 0;
  const totalinvoiced = row?.totalinvoiced ? row.totalinvoiced : 0;
  const totalDiscount = row?.totalDiscount ? row.totalDiscount : 0;
  const totalpaid = row?.totalpaid ? row.totalpaid : 0;
  const toatlExpenses = row?.toatlExpenses ? row.toatlExpenses : 0;
  const progress = row?.progress ? row.progress : 0;

  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const [getItems, itemsData]: any = useLazyQuery(getTaskItems, {
    fetchPolicy: 'cache-and-network',
  });

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
    getOverallTotal();
  }, [evList]);

  useEffect(() => {
    if (row && row._id) {
      const variables = { taskId: row.id };
      getItems({ variables });
    }
  }, [row]);

  const getOverallTotal = () => {
    const evssum = _.sumBy(evList, 'amount');
    setTotal(evssum);
  };

  const resetAllForms = () => {
    setEvList([]);
    setValue(0);
  };

  const onCloseForm = () => {
    resetAllForms();
    onClose();
  };

  const viewtotal = total ? total : amount;
  const title = `${words.task} : ${row?.title}`;

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
      bgcolor={colors.deepPurple[500]}
      mb={10}
    >
      <>
        <Grid container spacing={0}>
          <Grid item xs={11}>
            <Box
              style={{
                backgroundColor: '#eee',
              }}
            >
              <Box display="flex" style={{ margin: 10 }}></Box>

              {row && (
                <Box style={{ marginBottom: 20 }}>
                  <TabPanel value={value} index={0}>
                    <EventsCustomer
                      resourses={resourses}
                      employees={employees}
                      departments={departments}
                      customers={customers}
                      servicesproducts={servicesproducts}
                      isEditor={isEditor}
                      isRTL={isRTL}
                      words={words}
                      theme={theme}
                      isNew={isNew}
                      name="taskId"
                      value={row}
                      id={row?.id}
                    ></EventsCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <InvoicesCustomer
                      isRTL={isRTL}
                      words={words}
                      isEditor={isEditor}
                      resourses={resourses}
                      employees={employees}
                      departments={departments}
                      company={company}
                      servicesproducts={servicesproducts}
                      name="taskId"
                      value={row}
                      id={row?.id}
                    ></InvoicesCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <ReceiptCustomer
                      isRTL={isRTL}
                      words={words}
                      isEditor={isEditor}
                      theme={theme}
                      name="taskId"
                      value={row}
                      id={row?.id}
                    ></ReceiptCustomer>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <ExpensesCustomer
                      isRTL={isRTL}
                      words={words}
                      isEditor={isEditor}
                      theme={theme}
                      name="taskId"
                      value={row}
                      id={row?.id}
                    ></ExpensesCustomer>
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
                        style={{ fontSize: 14, color: colors.red[500] }}
                      >
                        {isRTL ? 'المتبقي' : 'Due Payment'}
                      </Typography>{' '}
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          color: colors.red[500],
                        }}
                      >
                        {moneyFormat(totalinvoiced - totalpaid - totalDiscount)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography style={{ fontSize: 14 }}>
                        {isRTL ? 'المصاريف' : 'Total Expenses'}
                      </Typography>{' '}
                      <Typography style={{ fontWeight: 'bold', fontSize: 14 }}>
                        {moneyFormat(toatlExpenses)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        style={{ fontSize: 14, color: colors.blue[500] }}
                      >
                        {isRTL ? 'صافي الايراد' : 'Total Income'}
                      </Typography>{' '}
                      <Typography
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          color: colors.blue[500],
                        }}
                      >
                        {moneyFormat(
                          totalinvoiced - toatlExpenses - totalDiscount
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
          {row && (
            <Grid item xs={1}>
              <Box style={{ marginTop: 10, marginBottom: 100 }}>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="items"
                  className={classes.tabs}
                >
                  {taskManamentTabs.map((item: any) => {
                    return (
                      <Tab
                        style={{
                          backgroundColor:
                            value === item.id ? '#eee' : undefined,
                        }}
                        label={isRTL ? item.nameAr : item.name}
                        {...a11yProps(item.id)}
                      />
                    );
                  })}
                </Tabs>
              </Box>
              <Box
                style={{
                  backgroundColor: '#eee',
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
                  {words.newInvoice}
                </Button>
              </Box>
            </Grid>
          )}
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
            setEvList={setEvList}
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
      </>
    </PopupLayout>
  );
};

export default PopupTaskView;
