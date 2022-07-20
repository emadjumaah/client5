/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Grid } from '@material-ui/core';
import { moneyFormat, moneyFormatSimple } from '../../../Shared/colorFormat';
import { InfoBox } from '../../../components';
import SalesDaysChart from '../../../components/charts/SalesDaysChart';
import MonthsChart from '../../../components/charts/MonthsChart';

import DaysEvents from '../../../components/charts/DaysEvents';
import MonthsEmpChart from '../../../components/charts/MonthsEmpChart';
import InfoBoxDark from '../../../components/charts/InfoBoxDark';
import useLandingChart from '../../../hooks/useLandingChart';
import PageLayout from '../PageLayout';
import React, { useEffect, useState } from 'react';
import useEmployees from '../../../hooks/useEmployees';
import useDepartments from '../../../hooks/useDepartments';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { Loading } from '../../../Shared';
import { roles } from '../../../common';
import useResourses from '../../../hooks/useResourses';
import Cars from '../../../components/charts/Cars';
import { useTemplate } from '../../../hooks';
import RemindersOutBox from '../../../Shared/RemindersOutBox';
import AppointmentsOutBox from '../../../Shared/AppointmentsOutBox';

export default function CarLanding(props: any) {
  const [loading, setLoading] = useState(true);

  const { words, isRTL, user, theme, menuitem } = props;

  const { resourses } = useResourses();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { height } = useWindowDimensions();
  const { tempwords, templateId } = useTemplate();

  const {
    salesDays,
    nextEventDays,
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
  const isRent = [4, 7, 9].includes(templateId);
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
            <Grid item xs={4}>
              {roles.isEditor() && resourses && isRent && (
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
              )}
            </Grid>
            <Grid item xs={4}>
              {nextEventDays && roles.isEditor() && (
                <DaysEvents
                  dataKey="count"
                  theme={theme}
                  isRTL={isRTL}
                  data={nextEventDays}
                  height={300}
                  prim={prim}
                ></DaysEvents>
              )}
            </Grid>
            <Grid item xs={4}>
              {salesDays && roles.isFinanceAdmin() && (
                <SalesDaysChart
                  dataKey="total"
                  isRTL={isRTL}
                  data={salesDays}
                  color={salesColor}
                  height={300}
                  prim={prim}
                ></SalesDaysChart>
              )}
            </Grid>
            <Grid item xs={6}>
              <RemindersOutBox
                isRTL={isRTL}
                words={words}
                height={500}
                theme={theme}
              ></RemindersOutBox>
            </Grid>
            <Grid item xs={6}>
              <AppointmentsOutBox
                isRTL={isRTL}
                words={words}
                height={500}
                theme={theme}
              ></AppointmentsOutBox>
            </Grid>

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
