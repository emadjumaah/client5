import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function ExpensesChart({ row, pcolor, ecolor, height }: any) {
  const { toatlExpenses, toatlProdExpenses } = row;
  const data = [
    {
      name: 'Expenses',
      toatlExpenses: toatlExpenses ? toatlExpenses : 0,
      toatlProdExpenses: toatlProdExpenses ? toatlProdExpenses : 0,
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
        <Bar dataKey="toatlExpenses" stackId="a" fill={ecolor} />
        <Bar dataKey="toatlProdExpenses" stackId="a" fill={pcolor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
