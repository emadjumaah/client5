import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function KaidsChart({ row, ccolor, dcolor, height }: any) {
  const { totalKaidscredit, totalkaidsdebit } = row;
  const data = [
    {
      name: 'Expenses',
      totalKaidscredit: totalKaidscredit ? totalKaidscredit : 0,
      totalkaidsdebit: totalkaidsdebit ? totalkaidsdebit : 0,
    },
  ];
  const h = height ? height : 100;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={h * 0.8}
        height={h}
        data={data}
        margin={{
          top: 10,
          right: 5,
          left: 0,
          bottom: 10,
        }}
      >
        <Bar dataKey="totalKaidscredit" fill={ccolor} />
        <Bar dataKey="totalkaidsdebit" fill={dcolor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
