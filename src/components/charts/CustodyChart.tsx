import { Box } from '@material-ui/core';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function CustodyChart({
  row,
  height,
  dcolor,
  ccolor,
  pcolor,
  rcolor,
}: any) {
  const {
    totalCustodyDebit,
    totalCustodyCredit,
    totalAdvancePay,
    totalAdvanceRec,
  } = row;
  const data = [
    {
      name: 'Custody',
      totalCustodyDebit: totalCustodyDebit ? totalCustodyDebit : 0,
      totalCustodyCredit: totalCustodyCredit ? totalCustodyCredit : 0,
      totalAdvancePay: totalAdvancePay ? totalAdvancePay : 0,
      totalAdvanceRec: totalAdvanceRec ? totalAdvanceRec : 0,
    },
  ];
  const h = 220;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Box display={'flex'} flex={1}>
        <BarChart
          width={h * 0.6}
          height={h}
          data={data}
          margin={{
            top: 10,
            right: 5,
            left: 0,
            bottom: 10,
          }}
        >
          <Bar dataKey="totalCustodyDebit" fill={dcolor} />
          <Bar dataKey="totalCustodyCredit" fill={ccolor} />
        </BarChart>
        <BarChart
          width={h * 0.6}
          height={h}
          data={data}
          margin={{
            top: 10,
            right: 5,
            left: 0,
            bottom: 10,
          }}
        >
          <Bar dataKey="totalAdvancePay" fill={pcolor} />
          <Bar dataKey="totalAdvanceRec" fill={rcolor} />
        </BarChart>
      </Box>
    </ResponsiveContainer>
  );
}
