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
import { useState } from 'react';
import useEmployees from '../../../hooks/useEmployees';
import useDepartments from '../../../hooks/useDepartments';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { LandingFooter, roles } from '../../../common';
import useResourses from '../../../hooks/useResourses';
import Cars from '../../../components/charts/Cars';
import { useExpenseItems, useServices } from '../../../hooks';
import RemindersOutBox from '../../../Shared/RemindersOutBox';
import AppointmentsOutBox from '../../../Shared/AppointmentsOutBox';
import EventsDaysChart from '../../../components/charts/EventsDaysChart';
import useRetypes from '../../../hooks/useRetypes';
import Empls from '../../../components/charts/Empls';
import useTasks from '../../../hooks/useTasks';
import Conts from '../../../components/charts/Conts';
import Invcs from '../../../components/charts/Invcs';
import { PopupInvoice } from '../../../pubups';
import { useMutation } from '@apollo/client';
import {
  createExpenses,
  createFinance,
  createInvoice,
  getLandingChartData,
} from '../../../graphql';
import PopupExpensesDoc from '../../../pubups/PopupExpensesDoc';
import PopupReceipt from '../../../pubups/PopupReceipt';
import PopupFinance from '../../../pubups/PopupFinance';
import PopupPaymentAdvance from '../../../pubups/PopupPaymentAdvance';
import PopupReceiptAdvance from '../../../pubups/PopupReceiptAdvance';

export default function CarLanding(props: any) {
  const {
    words,
    isRTL,
    user,
    theme,
    menuitem,
    company,
    tempwords,
    templateId,
  } = props;

  const [openInv, setOpenInv] = useState(false);
  const [openExpen, setOpenExpen] = useState(false);
  const [openRece, setOpenRece] = useState(false);
  const [openFins, setOpenFins] = useState(false);
  const [openPayAd, setOpenPayAd] = useState(false);
  const [openRecAd, setOpenRecAd] = useState(false);

  const { resourses } = useResourses();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { services } = useServices();
  const { expenseItems } = useExpenseItems();
  const { retypes } = useRetypes();
  const { tasks } = useTasks();

  const { height } = useWindowDimensions();
  const {
    salesDays,
    eventDays,
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
    loading,
  } = useLandingChart();

  const refresQuery = {
    refetchQueries: [{ query: getLandingChartData }],
  };

  const [addInvoice] = useMutation(createInvoice, refresQuery);
  const [addExpenses] = useMutation(createExpenses, refresQuery);
  const [addFinance] = useMutation(createFinance, refresQuery);

  const refresh = () => {
    if (refreshChartData) {
      refreshChartData();
    }
  };

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
                  title={tempwords?.resourses}
                  data={resourses}
                  retypes={retypes}
                  height={300}
                  isRTL={isRTL}
                  prim={prim}
                  templateId={templateId}
                ></Cars>
              )}
            </Grid>
            <Grid item xs={4}>
              {roles.isEditor() && resourses && isRent && (
                <Empls
                  title={tempwords?.employees}
                  data={employees}
                  retypes={retypes}
                  height={300}
                  isRTL={isRTL}
                  prim={prim}
                ></Empls>
              )}
            </Grid>
            <Grid item xs={4}>
              {roles.isEditor() && resourses && isRent && (
                <Conts
                  title={tempwords?.tasks}
                  data={tasks}
                  height={300}
                  isRTL={isRTL}
                  prim={prim}
                  templateId={templateId}
                ></Conts>
              )}
            </Grid>
            <Grid item xs={2}>
              <Invcs
                icon="sales"
                title={isRTL ? 'انشاء فاتورة' : 'Add Invoice'}
                height={300}
                onOpen={() => setOpenInv(true)}
                prim={prim}
              ></Invcs>
            </Grid>
            <Grid item xs={2}>
              <Invcs
                icon="expenses"
                title={isRTL ? 'انشاء مصروف' : 'Add Expenses'}
                height={300}
                onOpen={() => setOpenExpen(true)}
                prim={prim}
              ></Invcs>
            </Grid>
            <Grid item xs={2}>
              <Invcs
                icon="finance"
                title={isRTL ? 'انشاء سند قبض' : 'Add Receipt'}
                height={300}
                onOpen={() => setOpenRece(true)}
                prim={prim}
              ></Invcs>
            </Grid>
            <Grid item xs={2}>
              <Invcs
                icon="account"
                title={isRTL ? 'انشاء حركة مالية' : 'Add Finance'}
                height={300}
                onOpen={() => setOpenFins(true)}
                prim={prim}
              ></Invcs>
            </Grid>
            <Grid item xs={2}>
              <Invcs
                icon="balance"
                title={isRTL ? 'دفع سلفة' : 'Advanced Pay'}
                height={300}
                onOpen={() => setOpenPayAd(true)}
                prim={prim}
              ></Invcs>
            </Grid>
            <Grid item xs={2}>
              <Invcs
                icon="callaction"
                title={isRTL ? 'قبض سلفة' : 'Advanced Receipt'}
                height={300}
                onOpen={() => setOpenRecAd(true)}
                prim={prim}
              ></Invcs>
            </Grid>

            <Grid item xs={6}>
              <AppointmentsOutBox
                isRTL={isRTL}
                words={words}
                height={500}
                theme={theme}
                resourses={resourses}
                employees={employees}
                departments={departments}
                company={company}
                services={services}
                tasks={tasks}
              ></AppointmentsOutBox>
            </Grid>
            <Grid item xs={6}>
              <RemindersOutBox
                isRTL={isRTL}
                words={words}
                height={500}
                theme={theme}
                resourses={resourses}
                employees={employees}
                tasks={tasks}
              ></RemindersOutBox>
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
              {eventDays && roles.isOperateAdmin() && (
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
            <LandingFooter></LandingFooter>
          </Grid>
        </Box>
        <PopupInvoice
          open={openInv}
          onClose={() => setOpenInv(false)}
          addAction={addInvoice}
          editAction={() => null}
          resourses={resourses}
          employees={employees}
          departments={departments}
          company={company}
          servicesproducts={services}
          tasks={tasks}
          isNew={true}
          theme={theme}
        ></PopupInvoice>
        <PopupExpensesDoc
          open={openExpen}
          onClose={() => setOpenExpen(false)}
          isNew={true}
          addAction={addExpenses}
          editAction={() => null}
          resourses={resourses}
          employees={employees}
          departments={departments}
          servicesproducts={expenseItems}
          theme={theme}
          company={company}
        ></PopupExpensesDoc>
        <PopupReceipt
          open={openRece}
          onClose={() => setOpenRece(false)}
          isNew={true}
          addAction={addFinance}
          editAction={() => null}
          theme={theme}
          company={company}
        ></PopupReceipt>
        <PopupFinance
          open={openFins}
          onClose={() => setOpenFins(false)}
          isNew={true}
          addAction={addFinance}
          editAction={() => null}
          theme={theme}
        ></PopupFinance>
        <PopupPaymentAdvance
          open={openPayAd}
          onClose={() => setOpenPayAd(false)}
          isNew={true}
          addAction={addFinance}
          editAction={() => null}
          theme={theme}
          company={company}
        ></PopupPaymentAdvance>
        <PopupReceiptAdvance
          open={openRecAd}
          onClose={() => setOpenRecAd(false)}
          isNew={true}
          addAction={addFinance}
          editAction={() => null}
          theme={theme}
          company={company}
        ></PopupReceiptAdvance>
      </Box>
    </PageLayout>
  );
}
