/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  colors,
  Grid,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { moneyFormat } from '../Shared/colorFormat';
import EventsCustomer from '../Shared/EventsCustomer';
import InvoicesCustomer from '../Shared/InvoicesCustomer';
import ReceiptCustomer from '../Shared/ReceiptCustomer';
import ExpensesCustomer from '../Shared/ExpensesCustomer';
import TasksCustomer from '../Shared/TasksCustomer';
import { manamentTabs } from '../constants/rrule';
import ProjectsCustomer from '../Shared/ProjectsCustomer';
import KaidsCustomer from '../Shared/KaidsCustomer';
import ReminderCustomer from '../Shared/ReminderCustomer';

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
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 300,
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

const PopupDepartmentView = ({
  open,
  onClose,
  row,
  isNew,
  theme,
  departments,
  company,
  employees,
  resourses,
  servicesproducts,
  customers,
}: any) => {
  const classes = useStyles();

  const [value, setValue] = React.useState(1);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

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
  }: GContextTypes = useContext(GlobalContext);

  const title = `${words.department} : ${isRTL ? row?.nameAr : row?.name}`;

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={() => null}
      onlyclose
      theme={theme}
      alrt={{}}
      maxWidth={'xl'}
      mb={10}
      mt={10}
    >
      <Grid container spacing={0}>
        <Grid item xs={11}>
          <Box
            style={{
              backgroundColor: '#f5f5f5',
            }}
          >
            <Box display="flex" style={{ margin: 10 }}></Box>
            {row && (
              <Box style={{ marginBottom: 20 }}>
                <TabPanel value={value} index={0}>
                  <ProjectsCustomer
                    servicesproducts={servicesproducts}
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    company={company}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></ProjectsCustomer>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <TasksCustomer
                    servicesproducts={servicesproducts}
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    company={company}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></TasksCustomer>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <EventsCustomer
                    resourses={resourses}
                    employees={employees}
                    departments={departments}
                    customers={customers}
                    servicesproducts={servicesproducts}
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    isNew={isNew}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></EventsCustomer>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <InvoicesCustomer
                    isRTL={isRTL}
                    words={words}
                    employees={employees}
                    resourses={resourses}
                    departments={departments}
                    company={company}
                    theme={theme}
                    servicesproducts={servicesproducts}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></InvoicesCustomer>
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <ReceiptCustomer
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></ReceiptCustomer>
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <ExpensesCustomer
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></ExpensesCustomer>
                </TabPanel>
                <TabPanel value={value} index={6}>
                  <KaidsCustomer
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></KaidsCustomer>
                </TabPanel>
                <TabPanel value={value} index={7}>
                  <ReminderCustomer
                    resourses={resourses}
                    employees={employees}
                    departments={departments}
                    customers={customers}
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    isNew={isNew}
                    name="departmentId"
                    value={row}
                    id={row?._id}
                  ></ReminderCustomer>
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
                      {moneyFormat(amount)}
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
                      <Typography style={{ fontWeight: 'bold', fontSize: 14 }}>
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
                      {isRTL ? 'المصاريف' : 'Total Expenses'}
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
                        color: income < 0 ? colors.red[500] : colors.green[500],
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
            <Box style={{ marginTop: 10, marginBottom: 100 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="items"
                className={classes.tabs}
              >
                {manamentTabs.map((item: any) => {
                  if (item.hide) {
                    return <div></div>;
                  }
                  return (
                    <Tab
                      style={{
                        backgroundColor:
                          value === item.id ? '#f5f5f5' : undefined,
                      }}
                      label={isRTL ? item.nameAr : item.name}
                      {...a11yProps(item.id)}
                    />
                  );
                })}
              </Tabs>
            </Box>
          </Grid>
        )}
      </Grid>
    </PopupLayout>
  );
};

export default PopupDepartmentView;
