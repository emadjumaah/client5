import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function IncomeChart({ row, scolor, ecolor, height }: any) {
  const { totalinvoiced, toatlProdExpenses, toatlExpenses, totalDiscount } =
    row;
  const data = [
    {
      name: 'Sales',
      invoiced:
        (totalinvoiced ? totalinvoiced : 0) -
        (totalDiscount ? totalDiscount : 0),
      expenses:
        (toatlExpenses ? toatlExpenses : 0) +
        (toatlProdExpenses ? toatlProdExpenses : 0),
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
        <Bar isAnimationActive={false} dataKey="invoiced" fill={scolor} />
        <Bar isAnimationActive={false} dataKey="expenses" fill={ecolor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
