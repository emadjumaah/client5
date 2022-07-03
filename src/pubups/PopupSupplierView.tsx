/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useState } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import EventsCustomer from '../Shared/EventsCustomer';
import TasksCustomer from '../Shared/TasksCustomer';
import { supplierManamentTabs } from '../constants/rrule';
import ProjectsCustomer from '../Shared/ProjectsCustomer';
import InvoicesSupplier from '../Shared/InvoicesSupplier';
import PaymentSupplier from '../Shared/PaymentSupplier';
import useWindowDimensions from '../hooks/useWindowDimensions';
import MainCustomer from '../Shared/MainCustomer';
import { TabPanel, useStyles, a11yProps } from '../Shared/TabPanel';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import { useTemplate } from '../hooks';

const PopupSupplierView = ({ open, onClose, row, theme, company }: any) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
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

  const { width, height } = useWindowDimensions();
  const { tempoptions } = useTemplate();

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

  const title = `${words.supplier} : ${isRTL ? row?.nameAr : row?.name}`;

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseView}
      title={title}
      onSubmit={() => null}
      onlyclose
      theme={theme}
      alrt={{}}
      maxWidth={'xl'}
      mb={0}
      mt={0}
      preventclose
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
                    <Box style={{ marginBottom: 20 }}>
                      <TabPanel value={value} index={0}>
                        <MainCustomer
                          isRTL={isRTL}
                          words={words}
                          theme={theme}
                          name="supplierId"
                          value={row}
                          id={row?._id}
                          width={width}
                          height={height}
                          start={start}
                          end={end}
                        ></MainCustomer>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <ProjectsCustomer
                          isRTL={isRTL}
                          words={words}
                          name="supplierId"
                          id={row?._id}
                          width={width}
                          height={height}
                          start={start}
                          end={end}
                        ></ProjectsCustomer>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <TasksCustomer
                          isRTL={isRTL}
                          words={words}
                          theme={theme}
                          name="supplierId"
                          id={row?._id}
                          width={width}
                          height={height}
                          start={start}
                          end={end}
                        ></TasksCustomer>
                      </TabPanel>
                      <TabPanel value={value} index={3}>
                        <EventsCustomer
                          isRTL={isRTL}
                          words={words}
                          theme={theme}
                          id={row?._id}
                          name="supplierId"
                          width={width}
                          height={height}
                          start={start}
                          end={end}
                          value={row}
                          company={company}
                          tempoptions={tempoptions}
                        ></EventsCustomer>
                      </TabPanel>
                      <TabPanel value={value} index={4}>
                        <InvoicesSupplier
                          isRTL={isRTL}
                          words={words}
                          theme={theme}
                          name="supplierId"
                          id={row?._id}
                          width={width}
                          height={height}
                          start={start}
                          end={end}
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
                          name="supplierId"
                          id={row?._id}
                          width={width}
                          height={height}
                          start={start}
                          end={end}
                          value={row}
                          company={company}
                        ></PaymentSupplier>
                      </TabPanel>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
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
                {supplierManamentTabs.map((item: any) => {
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

export default PopupSupplierView;
