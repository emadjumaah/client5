/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';

import PageLayout from '../main/PageLayout';

import useWindowDimensions from '../../hooks/useWindowDimensions';
import getTrialBalance from '../../graphql/query/getTrialBalance';
import _ from 'lodash';
import { moneyFormatEmpty } from '../../Shared/colorFormat';

const full = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const mizania = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const arbah = [13, 14, 15];

export default function BudgetReport({ isRTL, words, menuitem, theme }: any) {
  // const [start, setStart] = useState<any>(null);
  // const [end, setEnd] = useState<any>(null);
  const [parentslist, setParentsList] = useState([]);
  const [pars, setPars] = useState(full);
  const [totals, setTotals] = useState({ credit: 0, debit: 0 });
  const [report, setReport] = useState<any>('tb');

  const [profit, setProfit] = useState<any>(null);

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
          (acc.credit !== 0 || acc.debit !== 0) && pars.includes(acc.parentcode)
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
          (acc.credit !== 0 || acc.debit !== 0) &&
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

      setProfit({ credit: profitrc, debit: profitrd });

      const lfilter = rfaccount.filter((rf: any) => rf.rd !== 0 || rf.rc !== 0);

      const allrd = _.sumBy(lfilter, 'rd');
      const allrc = _.sumBy(lfilter, 'rc');

      const bsrd = allrd + profitrd;
      const bsrc = allrc + profitrc;

      setTotals({
        credit: report === 'bs' ? bsrc : allrc,
        debit: report === 'bs' ? bsrd : allrd,
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
    getTB();
  }, []);
  // }, [start, end]);

  const refresh = () => {
    tbData?.refetch();
  };

  // const renderParentCell = (d: any, xs: any) => (
  //   <Grid item xs={xs}>
  //     <Typography style={{ fontWeight: 'bold' }}>{d}</Typography>
  //   </Grid>
  // );
  const renderAccountCell = (d: any, xs: any) => (
    <Grid item xs={xs}>
      <Typography style={{ padding: 10 }}>{d}</Typography>
    </Grid>
  );
  const renderAccountHeaderCell = (d: any, xs: any) => (
    <Grid item xs={xs}>
      <Typography style={{ padding: 10, fontWeight: 'bold' }}>{d}</Typography>
    </Grid>
  );

  const renderAccount = ({ pacc, isRTL }: any) => {
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
                      {renderAccountCell(accCode, 1)}
                      {renderAccountCell(name, 5)}
                      {renderAccountCell(moneyFormatEmpty(rd), 3)}
                      {renderAccountCell(moneyFormatEmpty(rc), 3)}
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
  // const renderAccountBox = ({ pacc, isRTL }: any) => {
  //   const { code, rdebit, rcredit, parent, parentAr, accounts } = pacc;
  //   const name = isRTL ? parentAr : parent;
  //   return (
  //     <Box borderRadius={10} p={2} m={2} style={{ backgroundColor: '#eee' }}>
  //       <Grid container spacing={2}>
  //         {renderParentCell(code, 1)}
  //         {renderParentCell(name, 5)}
  //         {renderParentCell(moneyFormatEmpty(rdebit), 3)}
  //         {renderParentCell(moneyFormatEmpty(rcredit), 3)}
  //         <Grid item xs={12}>
  //           <Box borderRadius={10} style={{ backgroundColor: '#fff' }}>
  //             <Grid container spacing={0}>
  //               {renderAccountHeaderCell('No', 1)}
  //               {renderAccountHeaderCell(isRTL ? 'الحساب' : 'Account', 5)}
  //               {renderAccountHeaderCell(isRTL ? 'مدين' : 'Debit', 3)}
  //               {renderAccountHeaderCell(isRTL ? 'دائن' : 'Credit', 3)}

  //               <Grid item xs={12}>
  //                 <Divider></Divider>
  //               </Grid>
  //               {accounts.map((acc: any) => {
  //                 const { accCode, accName, accNameAr, rd, rc } = acc;
  //                 const name = isRTL ? accNameAr : accName;
  //                 return (
  //                   <>
  //                     {renderAccountCell(accCode, 1)}
  //                     {renderAccountCell(name, 5)}
  //                     {renderAccountCell(moneyFormatEmpty(rd), 3)}
  //                     {renderAccountCell(moneyFormatEmpty(rc), 3)}
  //                   </>
  //                 );
  //               })}
  //             </Grid>
  //           </Box>
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   );
  // };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
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
          p={2}
          display="flex"
          style={{
            position: 'absolute',
            backgroundColor: '#fff',
            flex: 1,
            width: '80%',
          }}
        >
          <Button
            color="primary"
            variant={report === 'tb' ? 'contained' : 'outlined'}
            onClick={() => {
              setReport('tb');
              setPars(full);
            }}
            style={{ margin: 10, padding: 5, minWidth: 150 }}
          >
            {isRTL ? 'ميزان المراجعة' : 'Trial Sheet'}
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
            {isRTL ? 'قائمة الدخل' : 'Income Statment'}
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
            {isRTL ? 'الميزانية العمومية' : 'Balance Sheet'}
          </Button>
        </Box>
        <Box mt={12} ml={2} mr={2}>
          <Grid container spacing={0}>
            {renderAccountHeaderCell(isRTL ? 'الرقم' : 'No', 1)}
            {renderAccountHeaderCell(isRTL ? 'الحساب' : 'Account', 5)}
            {renderAccountHeaderCell(isRTL ? 'مدين' : 'Debit', 3)}
            {renderAccountHeaderCell(isRTL ? 'دائن' : 'Credit', 3)}
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
                  {isRTL ? 'قائمة الدخل' : 'Income Statment'}
                </Typography>
              </Grid>
              {renderAccountHeaderCell(moneyFormatEmpty(profit.debit), 3)}
              {renderAccountHeaderCell(moneyFormatEmpty(profit.credit), 3)}
            </Grid>
          )}
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Divider></Divider>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}></Grid>
            {renderAccountHeaderCell(moneyFormatEmpty(totals.debit), 3)}
            {renderAccountHeaderCell(moneyFormatEmpty(totals.credit), 3)}
          </Grid>
          <Grid item xs={12}>
            <Box m={6}></Box>
          </Grid>
        </Box>
      </Box>
    </PageLayout>
  );
}
