import { Box, Divider, Grid, Paper, Typography } from '@material-ui/core';
import _ from 'lodash';
import { moneyFormat } from './colorFormat';

const renderBalance = ({
  cucredit,
  cudebit,
  adcredit,
  addebit,
  isRTL,
}: any) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}></Grid>
      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'مدين' : 'Debit'}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'دائن' : 'Credit'}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'رصيد' : 'Balance'}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'حساب العهدة' : 'Custody'}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        {cucredit > 0 && <Typography>{moneyFormat(cucredit)}</Typography>}
      </Grid>
      <Grid item xs={3}>
        {cudebit > 0 && <Typography>{moneyFormat(cudebit)}</Typography>}
      </Grid>
      <Grid item xs={3}>
        <Typography>{moneyFormat(cudebit - cucredit)}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'حساب السلفة' : 'Advanced'}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        {adcredit > 0 && <Typography>{moneyFormat(adcredit)}</Typography>}
      </Grid>
      <Grid item xs={3}>
        {addebit > 0 && <Typography>{moneyFormat(addebit)}</Typography>}
      </Grid>
      <Grid item xs={3}>
        <Typography>{moneyFormat(addebit - adcredit)}</Typography>
      </Grid>
    </Grid>
  );
};
const renderIncomeItems = ({ income, isRTL, title }: any) => {
  const sumcredit = _.sumBy(income, 'credit');
  const sumdebit = _.sumBy(income, 'debit');
  const total = sumcredit - sumdebit;
  const arrow = isRTL ? ' ←' : '→ ';

  return (
    <Grid container spacing={2}>
      <Grid item xs={1}></Grid>
      <Grid item xs={5}>
        <Typography style={{ fontWeight: 'bold' }}>{title}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'العدد' : 'Quantity'}
        </Typography>
      </Grid>

      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'القيمة' : 'Amount'}
        </Typography>
      </Grid>
      <Grid item xs={1}></Grid>

      {income.map((item: any) => {
        const amount = item.credit - item.debit;
        const name =
          item.itemName && item.debit === 0
            ? isRTL
              ? item.itemNameAr
              : item.itemName
            : isRTL
            ? 'حسومات'
            : 'Discount';
        return (
          <>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}>
              <Typography>
                {arrow} {name}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              {item.qty > 0 && <Typography>{item.qty}</Typography>}
            </Grid>
            <Grid item xs={3}>
              <Typography>{moneyFormat(amount)}</Typography>
            </Grid>
            <Grid item xs={1}></Grid>
          </>
        );
      })}
      <Grid item xs={1}></Grid>
      <Grid item xs={5}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'المجموع' : 'Total'}
        </Typography>
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {moneyFormat(total)}
        </Typography>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
};
const renderExpensesItems = ({
  expense,
  isRTL,
  title,
  totalAdvancePayTime,
  totalAdvanceRecTime,
  totalCustodyCreditTime,
  totalCustodyDebitTime,
}: any) => {
  const expcredit = _.sumBy(expense, 'credit');
  const expdebit = _.sumBy(expense, 'debit');
  const advbalance = totalAdvanceRecTime - totalAdvancePayTime;
  const custbalance = totalCustodyDebitTime - totalCustodyCreditTime;
  const expbalance = expdebit - expcredit;
  console.log('expbalance', expbalance);
  console.log('advbalance', advbalance);
  console.log('custbalance', custbalance);
  const total = advbalance + custbalance + expbalance;
  const arrow = isRTL ? ' ←' : '→ ';

  return (
    <Grid container spacing={2}>
      <Grid item xs={1}></Grid>
      <Grid item xs={5}>
        <Typography style={{ fontWeight: 'bold' }}>{title}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'العدد' : 'Quantity'}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'القيمة' : 'Amount'}
        </Typography>
      </Grid>
      <Grid item xs={1}></Grid>
      {expense.map((item: any) => {
        const amount = item.debit - item.credit;
        const name = isRTL ? item.itemNameAr : item.itemName;

        return (
          <>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}>
              <Typography>
                {arrow} {name}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              {item.qty > 0 && <Typography>{item.qty}</Typography>}
            </Grid>

            <Grid item xs={3}>
              <Typography>{moneyFormat(amount)}</Typography>
            </Grid>
            <Grid item xs={1}></Grid>
          </>
        );
      })}
      <Grid item xs={4}>
        <Typography>
          {arrow} {isRTL ? 'العهدة' : 'Custody'}
        </Typography>
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={2}>
        {totalCustodyDebitTime > 0 && (
          <Typography>{moneyFormat(totalCustodyDebitTime)}</Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        {totalCustodyCreditTime > 0 && (
          <Typography>{moneyFormat(totalCustodyCreditTime)}</Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        {<Typography>{moneyFormat(custbalance)}</Typography>}
      </Grid>
      <Grid item xs={4}>
        <Typography>
          {arrow} {isRTL ? 'السلفة' : 'Advanced'}
        </Typography>
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={2}>
        {totalAdvanceRecTime > 0 && (
          <Typography>{moneyFormat(totalAdvanceRecTime)}</Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        {totalAdvancePayTime > 0 && (
          <Typography>{moneyFormat(totalAdvancePayTime)}</Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        {<Typography>{moneyFormat(advbalance)}</Typography>}
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ fontWeight: 'bold' }}>
          {isRTL ? 'المجموع' : 'Total'}
        </Typography>
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={2}>
        <Typography style={{ fontWeight: 'bold' }}>
          {moneyFormat(total)}
        </Typography>
      </Grid>
    </Grid>
  );
};

// credit دائن

function SalaryBox({ data, isRTL, height }) {
  console.log('data', data);
  const {
    totalAdvancePay,
    totalAdvancePayTime,
    totalAdvanceRec,
    totalAdvanceRecTime,
    totalCustodyCredit,
    totalCustodyCreditTime,
    totalCustodyDebit,
    totalCustodyDebitTime,
    expense,
    income,
  } = data;

  const totalIncCredit = _.sumBy(income, 'credit');
  const totalIncDebit = _.sumBy(income, 'debit');
  const totalExpCredit = _.sumBy(expense, 'credit');
  const totalExpDebit = _.sumBy(expense, 'debit');

  return (
    <Paper
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        height,
        overflow: 'auto',
        padding: 10,
      }}
    >
      <Box style={{ marginTop: 20 }}></Box>
      {renderBalance({
        cucredit: totalCustodyCredit,
        cudebit: totalCustodyDebit,
        adcredit: totalAdvancePay,
        addebit: totalAdvanceRec,
        isRTL,
      })}
      <Divider style={{ margin: 20 }}></Divider>
      {renderIncomeItems({
        income,
        isRTL,
        title: isRTL ? 'المبيعات' : 'Sales',
      })}
      <Divider style={{ margin: 20 }}></Divider>
      {renderExpensesItems({
        expense,
        isRTL,
        title: isRTL ? 'المبيعات' : 'Sales',
        totalAdvancePayTime,
        totalAdvanceRecTime,
        totalCustodyCreditTime,
        totalCustodyDebitTime,
      })}
    </Paper>
  );
}

export default SalaryBox;
