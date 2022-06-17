/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  Grid,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import EventsCustomer from '../Shared/EventsCustomer';
import InvoicesCustomer from '../Shared/InvoicesCustomer';
import ReceiptCustomer from '../Shared/ReceiptCustomer';
import ExpensesCustomer from '../Shared/ExpensesCustomer';
import TasksCustomer from '../Shared/TasksCustomer';
import { manamentTabs } from '../constants/rrule';
import ProjectsCustomer from '../Shared/ProjectsCustomer';
import KaidsCustomer from '../Shared/KaidsCustomer';
import ReminderCustomer from '../Shared/ReminderCustomer';
import ExpensesProdCustomer from '../Shared/ExpensesProdCustomer';
import InvoicesSupplier from '../Shared/InvoicesSupplier';
import PaymentSupplier from '../Shared/PaymentSupplier';
import useWindowDimensions from '../hooks/useWindowDimensions';
import MainCustomer from '../Shared/MainCustomer';

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
  products,
  customers,
}: any) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { width, height } = useWindowDimensions();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

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
      mb={0}
      mt={10}
    >
      <Box style={{ display: 'flex', marginTop: 0 }}>
        <Box>
          <Grid container spacing={0} style={{ width: width - 300 }}>
            <Grid item xs={12}>
              <Box
                style={{
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Box display="flex" style={{ margin: 10 }}></Box>
                {row && (
                  <Box>
                    <TabPanel value={value} index={0}>
                      <MainCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></MainCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <ProjectsCustomer
                        servicesproducts={servicesproducts}
                        products={products}
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        company={company}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></ProjectsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <TasksCustomer
                        servicesproducts={servicesproducts}
                        products={products}
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        company={company}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></TasksCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
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
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></EventsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <InvoicesCustomer
                        isRTL={isRTL}
                        words={words}
                        employees={employees}
                        resourses={resourses}
                        departments={departments}
                        company={company}
                        theme={theme}
                        servicesproducts={servicesproducts}
                        products={products}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></InvoicesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                      <ReceiptCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></ReceiptCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                      <InvoicesSupplier
                        isRTL={isRTL}
                        words={words}
                        resourses={resourses}
                        employees={employees}
                        departments={departments}
                        company={company}
                        theme={theme}
                        servicesproducts={servicesproducts}
                        products={products}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></InvoicesSupplier>
                    </TabPanel>
                    <TabPanel value={value} index={7}>
                      <PaymentSupplier
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></PaymentSupplier>
                    </TabPanel>
                    <TabPanel value={value} index={8}>
                      <ExpensesCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></ExpensesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={9}>
                      <ExpensesProdCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></ExpensesProdCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={10}>
                      <KaidsCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="departmentId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                      ></KaidsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={11}>
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
                        width={width}
                        height={height}
                      ></ReminderCustomer>
                    </TabPanel>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        {row && (
          <Box style={{ marginTop: 10, width: 200 }}>
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
                    label={
                      <Typography style={{ fontWeight: 'bold', fontSize: 13 }}>
                        {isRTL ? item.nameAr : item.name}
                      </Typography>
                    }
                    {...a11yProps(item.id)}
                  />
                );
              })}
            </Tabs>
          </Box>
        )}
      </Box>
    </PopupLayout>
  );
};

export default PopupDepartmentView;
