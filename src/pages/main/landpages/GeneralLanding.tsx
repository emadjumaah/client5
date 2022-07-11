/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Grid } from '@material-ui/core';
import { moneyFormat, moneyFormatSimple } from '../../../Shared/colorFormat';
import { InfoBox } from '../../../components';
import SalesDaysChart from '../../../components/charts/SalesDaysChart';
import MonthsChart from '../../../components/charts/MonthsChart';

import DaysEvents from '../../../components/charts/DaysEvents';
import EventsDaysChart from '../../../components/charts/EventsDaysChart';
import PercentChart from '../../../components/charts/PercentChart';
import MonthsEmpChart from '../../../components/charts/MonthsEmpChart';
import InfoBoxDark from '../../../components/charts/InfoBoxDark';
import useLandingChart from '../../../hooks/useLandingChart';
import PageLayout from '../PageLayout';
import React, { useEffect, useState } from 'react';
import useEmployeesUp from '../../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../../hooks/useDepartmentsUp';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { Loading } from '../../../Shared';
import { roles } from '../../../common';
import useResoursesUp from '../../../hooks/useResoursesUp';
import Cars from '../../../components/charts/Cars';
import { useTemplate } from '../../../hooks';

export default function GeneralLanding(props: any) {
  const [loading, setLoading] = useState(true);

  const { words, isRTL, user, theme, menuitem } = props;

  const { resourses } = useResoursesUp();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { height } = useWindowDimensions();
  const { tempwords, templateId } = useTemplate();

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
    eventsMonth,
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

  useEffect(() => {
    if (salesMonths) {
      setLoading(false);
    }
  }, [salesMonths]);

  const salesColor = theme.palette.primary.light;
  const eventColor = theme.palette.secondary.main;
  const prim = theme.palette.primary.light;
  const isRent = [4, 7].includes(templateId);
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
        <Box
          style={{
            marginTop: 15,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 15,
          }}
        >
          {loading && <Loading isRTL={isRTL}></Loading>}
          <Grid container spacing={2}>
            {roles.isBranchAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBoxDark
                  title={isRTL ? 'الصندوق' : 'Cash'}
                  value={moneyFormat(raseeds?.cash)}
                  icon="cash"
                  color={prim}
                  salesColor={salesColor}
                  eventColor={eventColor}
                ></InfoBoxDark>
              </Grid>
            )}
            {roles.isBranchAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBoxDark
                  title={words.card}
                  value={moneyFormat(raseeds?.card)}
                  icon="card"
                  color={prim}
                  salesColor={salesColor}
                  eventColor={eventColor}
                ></InfoBoxDark>
              </Grid>
            )}
            {roles.isFinanceAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBox
                  title={isRTL ? 'اليوم' : 'Today'}
                  value={moneyFormat(salesTodayTotal)}
                  icon="sales"
                  color={salesColor}
                  desc={isRTL ? 'مبيعات هذا اليوم' : 'Today Sales'}
                ></InfoBox>
              </Grid>
            )}
            {roles.isFinanceAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBox
                  title={isRTL ? 'هذا الشهر' : 'This Month'}
                  value={moneyFormat(salesMonthTotal)}
                  icon="sales"
                  color={salesColor}
                  desc={isRTL ? 'مبيعات هذا الشهر' : 'This Month Sales'}
                ></InfoBox>
              </Grid>
            )}
            {roles.isOperateAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBox
                  title={isRTL ? 'اليوم' : 'Today'}
                  value={moneyFormatSimple(eventsTodayCount)}
                  icon="event"
                  color={eventColor}
                  desc={isRTL ? 'المواعيد اليوم' : 'Appointments Today'}
                ></InfoBox>
              </Grid>
            )}
            {roles.isOperateAdmin() && (
              <Grid item xs={6} md={4}>
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
            )}

            {roles.isEditor() && resourses && isRent && (
              <Grid item xs={12} md={4}>
                <Cars
                  title={
                    isRTL
                      ? `انشغال ${tempwords?.resourses}`
                      : `${tempwords?.resourses} Availability`
                  }
                  data={resourses}
                  height={300}
                  isRTL={isRTL}
                  prim={prim}
                ></Cars>
              </Grid>
            )}
            {todayEvents && roles.isEditor() && (
              <Grid item xs={12} md={isRent ? 4 : 6}>
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
            {nextEventDays && roles.isEditor() && (
              <Grid item xs={12} md={isRent ? 4 : 6}>
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
            {salesDays && roles.isFinanceAdmin() && (
              <Grid item xs={12} md={6}>
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

            {eventDays && roles.isOperateAdmin() && (
              <Grid item xs={12} md={6}>
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
            {salesMonth && roles.isFinanceAdmin() && (
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
            {salesMonth && roles.isFinanceAdmin() && (
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
            {eventsMonth && roles.isOperateAdmin() && (
              <Grid item xs={12} md={6}>
                <MonthsEmpChart
                  data={eventsMonth}
                  isRTL={isRTL}
                  color={eventColor}
                  employee={true}
                  title={
                    isRTL
                      ? 'مواعيد هذا الشهر بحسب الموظف'
                      : 'Month Events - Employee'
                  }
                  prim={prim}
                  height={400}
                ></MonthsEmpChart>
              </Grid>
            )}
            {eventsMonth && roles.isOperateAdmin() && (
              <Grid item xs={12} md={6}>
                <MonthsEmpChart
                  data={eventsMonth}
                  isRTL={isRTL}
                  color={eventColor}
                  department={true}
                  title={
                    isRTL
                      ? 'مواعيد هذا الشهر بحسب القسم'
                      : 'Month Events - Department'
                  }
                  height={400}
                  prim={prim}
                ></MonthsEmpChart>
              </Grid>
            )}
            {salesMonths && roles.isFinanceAdmin() && (
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
            {eventMonths && roles.isOperateAdmin() && (
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
          <Grid item xs={12}>
            <Box
              style={{
                minHeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 50,
                color: '#bbb',
              }}
            >
              JADWAL.IO
            </Box>
          </Grid>
        </Box>
      </Box>
    </PageLayout>
  );
}
