import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function ExpensesChart({
  row,
  ecolor,
  pcolor,
  bcolor,
  dcolor,
  height,
}: any) {
  const { toatlExpenses, totalExpPetty, toatlExpPayable, toatlProdExpenses } =
    row;
  const data = [
    {
      name: 'Expenses',
      toatlExpenses: toatlExpenses ? toatlExpenses : 0,
      totalExpPetty: totalExpPetty ? totalExpPetty : 0,
      toatlExpPayable: toatlExpPayable ? toatlExpPayable : 0,
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
        <Bar dataKey="toatlExpenses" fill={ecolor} />
        <Bar dataKey="totalExpPetty" fill={pcolor} />
        <Bar dataKey="toatlExpPayable" fill={bcolor} />
        <Bar dataKey="toatlProdExpenses" fill={dcolor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
