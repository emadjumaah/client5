/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useState } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
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
import { projectManamentTabs } from '../constants/rrule';
import KaidsCustomer from '../Shared/KaidsCustomer';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { TabPanel, useStyles, a11yProps } from '../Shared/TabPanel';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import MainCustomer from '../Shared/MainCustomer';
import InvoicesSupplier from '../Shared/InvoicesSupplier';
import ReminderCustomer from '../Shared/ReminderCustomer';
import ExpensesProdCustomer from '../Shared/ExpensesProdCustomer';
import PaymentSupplier from '../Shared/PaymentSupplier';
import { useTemplate } from '../hooks';

const PopupProjectView = ({ open, onClose, row, theme, company }: any) => {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [currentViewName, setCurrentViewName] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isTime, setIsTime] = useState(false);

  const currentViewNameChange = (e: any) => {
    setCurrentViewName(e.target.value);
  };
  const currentDateChange = (curDate: any) => {
    setCurrentDate(curDate);
  };

  const endDateChange = (curDate: any) => {
    setEndDate(curDate);
  };
  const { width, height } = useWindowDimensions();
  const { tempoptions, tempwords } = useTemplate();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const onCloseView = () => {
    setValue(0);
    onClose();
  };

  const title = `${tempwords.project} : ${isRTL ? row?.nameAr : row?.name}`;

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseView}
      title={title}
      onSubmit={() => null}
      theme={theme}
      alrt={{}}
      maxWidth={'xl'}
      mb={0}
      mt={0}
      onlyclose
      preventclose
    >
      <Box>
        <Box display="flex" style={{ backgroundColor: '#fff', height: 50 }}>
          <Box display="flex" style={{ padding: 7 }}>
            <FormControlLabel
              control={
                <Checkbox
                  style={{ padding: 7 }}
                  checked={isTime}
                  onChange={() => {
                    setIsTime(!isTime);
                  }}
                  color="primary"
                />
              }
              label={
                <Typography
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                >
                  {isRTL ? '?????????? ??????????????' : 'Activate Date'}
                </Typography>
              }
              style={{ fontSize: 14 }}
            />
          </Box>
          <Box
            style={{
              opacity: !isTime ? 0.5 : undefined,
              pointerEvents: !isTime ? 'none' : undefined,
            }}
          >
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
        </Box>
        <Box style={{ display: 'flex', marginTop: 0 }}>
          <Grid container spacing={0} style={{ width: width - 300 }}>
            <Grid item xs={12}>
              <Box
                style={{
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Box display="flex" style={{ margin: 10 }}></Box>
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
                        name="projectId"
                        value={row}
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                      ></MainCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <TasksCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                      ></TasksCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <EventsCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        tempoptions={tempoptions}
                      ></EventsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      <InvoicesCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        tempoptions={tempoptions}
                      ></InvoicesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <ReceiptCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                      ></ReceiptCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                      <InvoicesSupplier
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        value={row}
                        company={company}
                        tempoptions={tempoptions}
                      ></InvoicesSupplier>
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                      <PaymentSupplier
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        value={row}
                        company={company}
                      ></PaymentSupplier>
                    </TabPanel>
                    <TabPanel value={value} index={7}>
                      <ExpensesCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        tempoptions={tempoptions}
                        tempwords={tempwords}
                      ></ExpensesCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={8}>
                      <ExpensesProdCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        value={row}
                        company={company}
                        tempoptions={tempoptions}
                        tempwords={tempwords}
                      ></ExpensesProdCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={9}>
                      <KaidsCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        tempoptions={tempoptions}
                      ></KaidsCustomer>
                    </TabPanel>
                    <TabPanel value={value} index={10}>
                      <ReminderCustomer
                        isRTL={isRTL}
                        words={words}
                        theme={theme}
                        name="projectId"
                        id={row?._id}
                        width={width}
                        height={height}
                        start={isTime ? start : null}
                        end={isTime ? end : null}
                        tempoptions={tempoptions}
                      ></ReminderCustomer>
                    </TabPanel>
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
          {row && (
            <Box style={{ marginTop: 10, marginBottom: 200 }}>
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
                {projectManamentTabs.map((item: any) => {
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
          )}
        </Box>
      </Box>
    </PopupLayout>
  );
};

export default PopupProjectView;
