/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext } from 'react';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, colors, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { moneyFormat } from '../Shared/colorFormat';
import EventsCustomer from '../Shared/EventsCustomer';
import InvoicesCustomer from '../Shared/InvoicesCustomer';
import ReceiptCustomer from '../Shared/ReceiptCustomer';
import ExpensesCustomer from '../Shared/ExpensesCustomer';
import TasksCustomer from '../Shared/TasksCustomer';
import { projectManamentTabs } from '../constants/rrule';
import ProjectsCustomer from '../Shared/ProjectsCustomer';
import KaidsCustomer from '../Shared/KaidsCustomer';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { TabPanel, useStyles, a11yProps } from '../Shared/TabPanel';

const PopupProjectView = ({ open, onClose, row, theme }: any) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);
  const { width, height } = useWindowDimensions();

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
                    isRTL={isRTL}
                    words={words}
                    name="projectId"
                    id={row?._id}
                    width={width}
                    height={height}
                    start={null}
                    end={null}
                  ></ProjectsCustomer>
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
                    start={null}
                    end={null}
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
                    start={null}
                    end={null}
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
                    start={null}
                    end={null}
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
                    start={null}
                    end={null}
                  ></ReceiptCustomer>
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <ExpensesCustomer
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    name="projectId"
                    id={row?._id}
                    width={width}
                    height={height}
                    start={null}
                    end={null}
                  ></ExpensesCustomer>
                </TabPanel>
                <TabPanel value={value} index={6}>
                  <KaidsCustomer
                    isRTL={isRTL}
                    words={words}
                    theme={theme}
                    name="projectId"
                    id={row?._id}
                    width={width}
                    height={height}
                    start={null}
                    end={null}
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
          </Grid>
        )}
      </Grid>
    </PopupLayout>
  );
};

export default PopupProjectView;
