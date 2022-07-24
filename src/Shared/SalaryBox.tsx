import {
  Box,
  colors,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import _ from 'lodash';
import { CalenderLocal } from '../components';
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
        <Typography
          style={{ fontWeight: 'bold', fontSize: 18, color: colors.blue[500] }}
        >
          {title}
        </Typography>
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
const renderExpensesItems = ({ expense, isRTL, title }: any) => {
  const arrow = isRTL ? ' ←' : '→ ';
  let total = 0;
  return (
    <Grid container spacing={2}>
      <Grid item xs={1}></Grid>
      <Grid item xs={5}>
        <Typography
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            color: colors.orange[500],
          }}
        >
          {title}
        </Typography>
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
        total = total + amount;
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

function SalaryBox({
  data,
  isRTL,
  words,
  height,
  start,
  setStart,
  end,
  setEnd,
}) {
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
      <Paper elevation={5} style={{ margin: 20, paddingBottom: 30 }}>
        <Grid container spacing={2}>
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <CalenderLocal
              isRTL={isRTL}
              label={words.start}
              value={start}
              onChange={(value: any) => setStart(value)}
            ></CalenderLocal>
          </Grid>
          <Grid item xs={5}>
            <CalenderLocal
              isRTL={isRTL}
              label={words.end}
              value={end}
              onChange={(value: any) => setEnd(value)}
            ></CalenderLocal>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
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
          title: isRTL ? 'المصروفات' : 'Expenses',
          totalAdvancePayTime,
          totalAdvanceRecTime,
          totalCustodyCreditTime,
          totalCustodyDebitTime,
        })}
      </Paper>
    </Paper>
  );
}

export default SalaryBox;
