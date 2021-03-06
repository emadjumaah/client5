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
import useEmployees from '../../../hooks/useEmployees';
import useDepartments from '../../../hooks/useDepartments';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { LandingFooter, roles } from '../../../common';
import useResourses from '../../../hooks/useResourses';
import Cars from '../../../components/charts/Cars';
import { useTemplate } from '../../../hooks';
import RemindersOutBox from '../../../Shared/RemindersOutBox';
import useRetypes from '../../../hooks/useRetypes';

export default function GeneralLanding(props: any) {
  const { words, isRTL, user, theme, menuitem } = props;

  const { resourses } = useResourses();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { height } = useWindowDimensions();
  const { tempwords, templateId } = useTemplate();
  const { retypes } = useRetypes();

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
    loading,
  } = useLandingChart();

  const refresh = () => {
    if (refreshChartData) {
      refreshChartData();
    }
  };

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
      loading={loading}
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
          <Grid container spacing={2}>
            {roles.isBranchAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBoxDark
                  title={isRTL ? '??????????????' : 'Cash'}
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
                  title={isRTL ? '??????????' : 'Today'}
                  value={moneyFormat(salesTodayTotal)}
                  icon="sales"
                  color={salesColor}
                  desc={isRTL ? '???????????? ?????? ??????????' : 'Today Sales'}
                ></InfoBox>
              </Grid>
            )}
            {roles.isFinanceAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBox
                  title={isRTL ? '?????? ??????????' : 'This Month'}
                  value={moneyFormat(salesMonthTotal)}
                  icon="sales"
                  color={salesColor}
                  desc={isRTL ? '???????????? ?????? ??????????' : 'This Month Sales'}
                ></InfoBox>
              </Grid>
            )}
            {roles.isOperateAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBox
                  title={isRTL ? '??????????' : 'Today'}
                  value={moneyFormatSimple(eventsTodayCount)}
                  icon="event"
                  color={eventColor}
                  desc={isRTL ? '???????????????? ??????????' : 'Appointments Today'}
                ></InfoBox>
              </Grid>
            )}
            {roles.isOperateAdmin() && (
              <Grid item xs={6} md={4}>
                <InfoBox
                  title={isRTL ? '?????? ??????????' : 'This Month'}
                  value={moneyFormatSimple(eventsMonthCount)}
                  icon="event"
                  color={eventColor}
                  desc={
                    isRTL ? '???????????????? ?????? ??????????' : 'Appointments This month'
                  }
                ></InfoBox>
              </Grid>
            )}

            {roles.isEditor() && resourses && isRent && (
              <Grid item xs={12} md={4}>
                <Cars
                  title={
                    isRTL
                      ? `???????????? ${tempwords?.resourses}`
                      : `${tempwords?.resourses} Availability`
                  }
                  data={resourses}
                  retypes={retypes}
                  height={300}
                  isRTL={isRTL}
                  prim={prim}
                  templateId={templateId}
                ></Cars>
              </Grid>
            )}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <RemindersOutBox
                    isRTL={isRTL}
                    words={words}
                    height={610}
                    theme={theme}
                    resourses={resourses}
                    employees={employees}
                  ></RemindersOutBox>
                </Grid>
                <Grid item xs={4}>
                  {todayEvents && roles.isEditor() && (
                    <PercentChart
                      pricolor={salesColor}
                      seccolor={eventColor}
                      data={todayEvents}
                      height={300}
                      prim={prim}
                      isRTL={isRTL}
                    />
                  )}
                  <Box style={{ marginTop: 10 }}></Box>
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
              </Grid>
            </Grid>

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
                      ? '???????????? ?????? ?????????? ???????? ????????????'
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
                      ? '???????????? ?????? ?????????? ???????? ??????????'
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
                      ? '???????????? ?????? ?????????? ???????? ????????????'
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
                      ? '???????????? ?????? ?????????? ???????? ??????????'
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
                  title={isRTL ? '???????????????? ???????? ????????????' : 'Months Sales'}
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
                  title={isRTL ? '???????????????? ???????? ????????????' : 'Months Appointment'}
                  prim={prim}
                  height={400}
                ></MonthsChart>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <LandingFooter></LandingFooter>
          </Grid>
        </Box>
      </Box>
    </PageLayout>
  );
}
