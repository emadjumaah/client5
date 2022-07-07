import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function SalesChart({
  row,
  scolor,
  pcolor,
  dcolor,
  acolor = '#555',
  height,
}: any) {
  const { totalinvoiced, totalpaid, totalDiscount, amount } = row;
  const data = [
    {
      name: 'Sales',
      totalinvoiced: totalinvoiced ? totalinvoiced : 0,
      totalpaid: totalpaid ? totalpaid : 0,
      totalDiscount: totalDiscount ? totalDiscount : 0,
      amount: amount ? amount : 0,
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
        <Bar isAnimationActive={false} dataKey="amount" fill={acolor} />
        <Bar isAnimationActive={false} dataKey="totalinvoiced" fill={scolor} />
        <Bar
          isAnimationActive={false}
          dataKey="totalpaid"
          stackId="a"
          fill={pcolor}
        />
        <Bar
          isAnimationActive={false}
          dataKey="totalDiscount"
          stackId="a"
          fill={dcolor}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
