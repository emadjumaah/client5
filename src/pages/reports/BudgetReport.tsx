/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';

import PageLayout from '../main/PageLayout';

import useWindowDimensions from '../../hooks/useWindowDimensions';
import getTrialBalance from '../../graphql/query/getTrialBalance';
import _ from 'lodash';
import { moneyFormatEmpty } from '../../Shared/colorFormat';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { BalanceReportP } from '../../print/BalanceReportP';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';

const full = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const mizania = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const arbah = [13, 14, 15];

export const renderAccountCell = (d: any, xs: any, p = 10) => (
  <Grid item xs={xs}>
    <Typography style={{ padding: p }}>{d}</Typography>
  </Grid>
);
export const renderAccountHeaderCell = (d: any, xs: any, p = 10) => (
  <Grid item xs={xs}>
    <Typography style={{ padding: p, fontWeight: 'bold' }}>{d}</Typography>
  </Grid>
);

export const renderAccount = ({ pacc, isRTL, p = 10 }: any) => {
  const { accounts } = pacc;
  return (
    <Box style={{ backgroundColor: '#eee' }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box style={{ backgroundColor: '#fff' }}>
            <Grid container spacing={0}>
              {accounts.map((acc: any) => {
                const { accCode, accName, accNameAr, rc, rd } = acc;
                const name = isRTL ? accNameAr : accName;
                return (
                  <>
                    <Grid item xs={12}>
                      <Divider></Divider>
                    </Grid>
                    {renderAccountCell(accCode, 1, p)}
                    {renderAccountCell(name, 5, p)}
                    {renderAccountCell(moneyFormatEmpty(rd), 3, p)}
                    {renderAccountCell(moneyFormatEmpty(rc), 3, p)}
                  </>
                );
              })}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function BudgetReport({
  isRTL,
  words,
  menuitem,
  theme,
  company,
}: any) {
  const [parentslist, setParentsList] = useState([]);
  const [pars, setPars] = useState(full);
  const [totals, setTotals] = useState(null);
  const [profit, setProfit] = useState<any>(null);
  const [report, setReport] = useState<any>('tb');

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

  const [getTB, tbData]: any = useLazyQuery(getTrialBalance, {
    fetchPolicy: 'cache-and-network',
  });
  const { height } = useWindowDimensions();

  useEffect(() => {
    const dd = tbData?.data?.['getTrialBalance']?.data;
    if (dd) {
      const accs = JSON.parse(dd);

      const faccs = accs.filter(
        (acc: any) =>
          (acc?.credit !== 0 || acc?.debit !== 0) &&
          pars.includes(acc.parentcode)
      );
      const rfaccount = faccs.map((fa: any) => {
        const { credit, debit } = fa;
        const raseed = debit - credit;
        let rc = 0;
        let rd = 0;
        if (raseed > 0) {
          rd = raseed;
        } else {
          rc = -raseed;
        }
        return {
          ...fa,
          rd,
          rc,
        };
      });

      const profitaccounts = accs.filter(
        (acc: any) =>
          (acc?.credit !== 0 || acc?.debit !== 0) &&
          arbah.includes(acc.parentcode)
      );
      const rprofitaccounts = profitaccounts.map((fa: any) => {
        const { credit, debit } = fa;
        const raseed = debit - credit;
        let rc = 0;
        let rd = 0;
        if (raseed > 0) {
          rd = raseed;
        } else {
          rc = -raseed;
        }
        return {
          ...fa,
          rd,
          rc,
        };
      });

      const profitfilter = rprofitaccounts.filter(
        (rf: any) => rf.rd !== 0 || rf.rc !== 0
      );

      const profitrd = _.sumBy(profitfilter, 'rd');
      const profitrc = _.sumBy(profitfilter, 'rc');

      const profitrs = profitrd - profitrc;

      setProfit({
        credit: profitrc,
        debit: profitrd,
        raseedd: profitrs > 0 ? profitrs : 0,
        raseedc: profitrs < 0 ? -profitrs : 0,
      });

      const lfilter = rfaccount.filter((rf: any) => rf.rd !== 0 || rf.rc !== 0);

      const allrd = _.sumBy(lfilter, 'rd');
      const allrc = _.sumBy(lfilter, 'rc');
      const allrsd = allrd - allrc;

      const bsrd = allrd + profitrd;
      const bsrc = allrc + profitrc;
      const bsrsd = bsrd - bsrc;

      const graseed = report === 'bs' ? bsrsd : allrsd;

      setTotals({
        credit: report === 'bs' ? bsrc : allrc,
        debit: report === 'bs' ? bsrd : allrd,
        raseedd: graseed > 0 ? graseed : 0,
        raseedc: graseed < 0 ? -graseed : 0,
      });

      const gaccs = _(lfilter)
        .groupBy('parentcode')
        .map((array, key) => ({
          code: Number(key),
          parent: array[0]?.parent,
          parentAr: array[0]?.parentAr,
          credit: _.sumBy(array, 'credit'),
          debit: _.sumBy(array, 'debit'),
          accounts: array,
        }))
        .orderBy('code')
        .value();

      const rfparent = gaccs.map((fa: any) => {
        const { credit, debit } = fa;
        const raseed = debit - credit;
        let rcredit = 0;
        let rdebit = 0;
        if (raseed > 0) {
          rdebit = raseed;
        } else {
          rcredit = -raseed;
        }
        return {
          ...fa,
          rdebit,
          rcredit,
        };
      });

      setParentsList(rfparent);
    }
  }, [tbData, pars]);

  useEffect(() => {
    const variables = isTime ? { start, end } : {};
    getTB({ variables });
  }, [start, end, isTime]);

  const refresh = () => {
    tbData?.refetch();
  };

  const componentRef: any = useRef();
  const documentTitle =
    report === 'tb'
      ? isRTL
        ? 'ميزان المراجعة'
        : 'Trial Sheet'
      : report === 'is'
      ? isRTL
        ? 'قائمة الدخل'
        : 'Income Statment'
      : report === 'bs'
      ? isRTL
        ? 'الميزانية العمومية'
        : 'Balance Sheet'
      : '';
  const print = useReactToPrint({
    content: () => componentRef.current,
    documentTitle,
    removeAfterPrint: true,
  });

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
      loading={tbData?.loading}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <Box
          p={1}
          display="flex"
          style={{
            position: 'absolute',
            backgroundColor: '#fff',
            flex: 1,
            width: '84%',
          }}
        >
          <Box>
            <Box display="flex">
              <Box style={{ padding: 7 }}>
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
                      {isRTL ? 'تفعيل التاريخ' : 'Activate Date'}
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
                  views={[30, 365, 1000]}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                ></DateNavigatorReports>
              </Box>
            </Box>
          </Box>
          <Box style={{ marginLeft: 100, marginRight: 100 }}>
            <Button
              color="primary"
              variant={report === 'tb' ? 'contained' : 'outlined'}
              onClick={() => {
                setReport('tb');
                setPars(full);
              }}
              style={{ margin: 10, padding: 5, minWidth: 150 }}
            >
              <Typography style={{ fontWeight: 'bold' }}>
                {isRTL ? 'ميزان المراجعة' : 'Trial Sheet'}
              </Typography>
            </Button>
            <Button
              color="primary"
              variant={report === 'is' ? 'contained' : 'outlined'}
              onClick={() => {
                setReport('is');
                setPars(arbah);
              }}
              style={{ margin: 10, padding: 5, minWidth: 150 }}
            >
              <Typography style={{ fontWeight: 'bold' }}>
                {isRTL ? 'قائمة الدخل' : 'Income Statment'}
              </Typography>
            </Button>
            <Button
              color="primary"
              variant={report === 'bs' ? 'contained' : 'outlined'}
              onClick={() => {
                setReport('bs');
                setPars(mizania);
              }}
              style={{ margin: 10, padding: 5, minWidth: 150 }}
            >
              <Typography style={{ fontWeight: 'bold' }}>
                {isRTL ? 'الميزانية العمومية' : 'Balance Sheet'}
              </Typography>
            </Button>
          </Box>
          <Box
            style={{
              position: 'absolute',
              left: isRTL ? 50 : undefined,
              right: isRTL ? undefined : 50,
              top: 15,
              zIndex: 112,
            }}
          >
            <IconButton onClick={print} title="Print Report" size="medium">
              <PrintIcon />
            </IconButton>
          </Box>
        </Box>
        <Box mt={8} ml={2} mr={2}>
          <Grid
            container
            spacing={0}
            style={{
              position: 'fixed',
              backgroundColor: '#fff',
              width: '84%',
            }}
          >
            <Grid item xs={12}>
              <Divider></Divider>
            </Grid>
            {renderAccountHeaderCell(isRTL ? 'الرقم' : 'No', 1)}
            {renderAccountHeaderCell(isRTL ? 'الحساب' : 'Account', 5)}
            {renderAccountHeaderCell(isRTL ? 'مدين' : 'Debit', 3)}
            {renderAccountHeaderCell(isRTL ? 'دائن' : 'Credit', 3)}
            <Grid item xs={12}>
              <Divider></Divider>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box style={{ height: 43 }}></Box>
          </Grid>
          {parentslist.map((pacc: any) => {
            return renderAccount({ pacc, isRTL });
          })}
          {report === 'bs' && (
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <Typography style={{ padding: 10, fontWeight: 'bold' }}>
                  {isRTL ? 'صافي ( الربح/الخسارة )' : 'Net Profit / Loss'}
                </Typography>
              </Grid>
              {renderAccountHeaderCell(moneyFormatEmpty(profit?.raseedd), 3)}
              {renderAccountHeaderCell(moneyFormatEmpty(profit?.raseedc), 3)}
            </Grid>
          )}

          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Divider></Divider>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}></Grid>
            {renderAccountHeaderCell(moneyFormatEmpty(totals?.debit), 3)}
            {renderAccountHeaderCell(moneyFormatEmpty(totals?.credit), 3)}
          </Grid>
          {report === 'is' && (
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <Typography style={{ padding: 10, fontWeight: 'bold' }}>
                  {isRTL ? 'صافي ( الربح/الخسارة )' : 'Net Profit / Loss'}
                </Typography>
              </Grid>
              {renderAccountHeaderCell(moneyFormatEmpty(profit?.raseedd), 3)}
              {renderAccountHeaderCell(moneyFormatEmpty(profit?.raseedc), 3)}
            </Grid>
          )}
          <Grid item xs={12}>
            <Box m={6}></Box>
          </Grid>
        </Box>
        <Box>
          <div style={{ display: 'none' }}>
            <BalanceReportP
              company={company}
              parentslist={parentslist}
              report={report}
              ref={componentRef}
              isRTL={isRTL}
              start={start}
              end={end}
              profit={profit}
              totals={totals}
              documentTitle={documentTitle}
              isTime={isTime}
            />
          </div>
        </Box>
      </Box>
    </PageLayout>
  );
}
