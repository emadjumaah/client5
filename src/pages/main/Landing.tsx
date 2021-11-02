/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Grid } from '@material-ui/core';
import { moneyFormat, moneyFormatSimple } from '../../Shared/colorFormat';
import { InfoBox } from '../../components';
import SalesDaysChart from '../../components/charts/SalesDaysChart';
import MonthsChart from '../../components/charts/MonthsChart';

import DaysEvents from '../../components/charts/DaysEvents';
import EventsDaysChart from '../../components/charts/EventsDaysChart';
import PercentChart from '../../components/charts/PercentChart';
import MonthsEmpChart from '../../components/charts/MonthsEmpChart';
import InfoBoxDark from '../../components/charts/InfoBoxDark';
import useLandingChart from '../../hooks/useLandingChart';
import PageLayout from './PageLayout';
import React from 'react';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function Landing(props: any) {
  const { words, isRTL, user, theme, menuitem } = props;

  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { height } = useWindowDimensions();

  const {
    salesDays,
    eventDays,
    nextEventDays,
    todayEvents,
    salesTodayTotal,
    eventsTodayCount,
    salesMonths,
    eventMonths,
    salesMonth,
    salesMonthTotal,
    eventsMonthCount,
    raseeds,
    refreshChartData,
  } = useLandingChart();

  const refresh = () => {
    if (refreshChartData) {
      refreshChartData();
    }
  };

  const salesColor = theme.palette.primary.light;
  const eventColor = theme.palette.secondary.main;
  const prim = theme.palette.primary.light;

  return (
    <PageLayout
      menuitem={menuitem}
      employees={employees}
      departments={departments}
      isRTL={isRTL}
      words={words}
      user={user}
      theme={theme}
      refresh={refresh}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <Box style={{ margin: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <InfoBoxDark
                    title={isRTL ? 'الصندوق' : 'Cash'}
                    value={moneyFormat(raseeds?.cash)}
                    icon="cash"
                    color={prim}
                    salesColor={salesColor}
                    eventColor={eventColor}
                  ></InfoBoxDark>
                </Grid>
                <Grid item xs={6} md={2}>
                  <InfoBoxDark
                    title={words.card}
                    value={moneyFormat(raseeds?.card)}
                    icon="card"
                    color={prim}
                    salesColor={salesColor}
                    eventColor={eventColor}
                  ></InfoBoxDark>
                </Grid>
                <Grid item xs={6} md={2}>
                  <InfoBox
                    title={isRTL ? 'اليوم' : 'Today'}
                    value={moneyFormat(salesTodayTotal)}
                    icon="sales"
                    color={salesColor}
                    desc={isRTL ? 'مبيعات هذا اليوم' : 'Today Sales'}
                  ></InfoBox>
                </Grid>

                <Grid item xs={6} md={2}>
                  <InfoBox
                    title={isRTL ? 'هذا الشهر' : 'This Month'}
                    value={moneyFormat(salesMonthTotal)}
                    icon="sales"
                    color={salesColor}
                    desc={isRTL ? 'مبيعات هذا الشهر' : 'This Month Sales'}
                  ></InfoBox>
                </Grid>
                <Grid item xs={6} md={2}>
                  <InfoBox
                    title={isRTL ? 'اليوم' : 'Today'}
                    value={moneyFormatSimple(eventsTodayCount)}
                    icon="event"
                    color={eventColor}
                    desc={isRTL ? 'المواعيد اليوم' : 'Appointments Today'}
                  ></InfoBox>
                </Grid>
                <Grid item xs={6} md={2}>
                  <InfoBox
                    title={isRTL ? 'هذا الشهر' : 'This Month'}
                    value={moneyFormatSimple(eventsMonthCount)}
                    icon="event"
                    color={eventColor}
                    desc={
                      isRTL ? 'المواعيد هذا الشهر' : 'Appointments This month'
                    }
                  ></InfoBox>
                </Grid>
              </Grid>
            </Grid>
            {todayEvents && (
              <Grid item xs={12} md={4}>
                <PercentChart
                  pricolor={salesColor}
                  seccolor={eventColor}
                  data={todayEvents}
                  height={300}
                  prim={prim}
                  isRTL={isRTL}
                />
              </Grid>
            )}
            {salesDays && (
              <Grid item xs={12} md={8}>
                <SalesDaysChart
                  dataKey="total"
                  isRTL={isRTL}
                  data={salesDays}
                  color={salesColor}
                  height={300}
                  prim={prim}
                ></SalesDaysChart>
              </Grid>
            )}
            {nextEventDays && (
              <Grid item xs={12} md={4}>
                <DaysEvents
                  dataKey="count"
                  theme={theme}
                  isRTL={isRTL}
                  data={nextEventDays}
                  height={300}
                  prim={prim}
                ></DaysEvents>
              </Grid>
            )}
            {eventDays && (
              <Grid item xs={12} md={8}>
                <EventsDaysChart
                  dataKey="count"
                  isRTL={isRTL}
                  data={eventDays}
                  color={eventColor}
                  pricolor={salesColor}
                  seccolor={eventColor}
                  height={300}
                  prim={prim}
                ></EventsDaysChart>
              </Grid>
            )}
            {salesMonth && (
              <Grid item xs={12} md={6}>
                <MonthsEmpChart
                  data={salesMonth}
                  isRTL={isRTL}
                  color={salesColor}
                  employee={true}
                  title={
                    isRTL
                      ? 'مبيعات هذا الشهر بحسب الموظف'
                      : 'Month Sales - Employee'
                  }
                  prim={prim}
                  height={400}
                ></MonthsEmpChart>
              </Grid>
            )}
            {salesMonth && (
              <Grid item xs={12} md={6}>
                <MonthsEmpChart
                  data={salesMonth}
                  isRTL={isRTL}
                  color={salesColor}
                  department={true}
                  title={
                    isRTL
                      ? 'مبيعات هذا الشهر بحسب القسم'
                      : 'Month Sales - Department'
                  }
                  height={400}
                  prim={prim}
                ></MonthsEmpChart>
              </Grid>
            )}
            {salesMonths && (
              <Grid item xs={12} md={6}>
                <MonthsChart
                  data={salesMonths}
                  isRTL={isRTL}
                  color={salesColor}
                  prim={prim}
                  dataKey="total"
                  title={isRTL ? 'المبيعات بحسب الشهور' : 'Months Sales'}
                  height={400}
                ></MonthsChart>
              </Grid>
            )}
            {eventMonths && (
              <Grid item xs={12} md={6}>
                <MonthsChart
                  data={eventMonths}
                  isRTL={isRTL}
                  color={eventColor}
                  dataKey="count"
                  title={isRTL ? 'المواعيد بحسب الشهور' : 'Months Appointment'}
                  prim={prim}
                  height={400}
                ></MonthsChart>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </PageLayout>
  );
}
