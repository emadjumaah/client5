/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Grid } from '@material-ui/core';
import { moneyFormat } from '../../../Shared/colorFormat';
import { InfoBox } from '../../../components';
import MonthsChart from '../../../components/charts/MonthsChart';
import MonthsEmpChart from '../../../components/charts/MonthsEmpChart';
import InfoBoxDark from '../../../components/charts/InfoBoxDark';
import PageLayout from '../PageLayout';
import useEmployees from '../../../hooks/useEmployees';
import useDepartments from '../../../hooks/useDepartments';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { LandingFooter, roles } from '../../../common';
import useResourses from '../../../hooks/useResourses';
import Cars from '../../../components/charts/Cars';
import { useTemplate } from '../../../hooks';
import useLandingSales from '../../../hooks/useLandingSales';
import RemindersOutBox from '../../../Shared/RemindersOutBox';
import useRetypes from '../../../hooks/useRetypes';

export default function DeliveryLanding(props: any) {
  const { words, isRTL, user, theme, menuitem } = props;

  const { resourses } = useResourses();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const { height } = useWindowDimensions();
  const { tempwords, templateId } = useTemplate();
  const { retypes } = useRetypes();

  const {
    salesMonths,
    salesMonth,
    salesMonthTotal,
    raseeds,
    refreshSalesData,
    loading,
  } = useLandingSales();

  const refresh = () => {
    if (refreshSalesData) {
      refreshSalesData();
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
                  title={isRTL ? 'مبيعات هذا الشهر' : 'This Month Sales'}
                  value={moneyFormat(salesMonthTotal)}
                  icon="sales"
                  color={salesColor}
                  desc={isRTL ? 'مبيعات هذا الشهر' : 'This Month Sales'}
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
                  retypes={retypes}
                  height={300}
                  isRTL={isRTL}
                  prim={prim}
                  templateId={templateId}
                ></Cars>
              </Grid>
            )}
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={12} md={6}>
              <RemindersOutBox
                isRTL={isRTL}
                words={words}
                height={400}
                theme={theme}
              ></RemindersOutBox>
            </Grid>
            {/* <Grid item xs={12} md={4}></Grid> */}
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
            {salesMonths && roles.isFinanceAdmin() && (
              <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
            <LandingFooter></LandingFooter>
          </Grid>
        </Box>
      </Box>
    </PageLayout>
  );
}
