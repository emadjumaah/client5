import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function SalesChart({
  row,
  scolor,
  pcolor,
  dcolor,
  height,
}: any) {
  const { totalinvoiced, totalpaid, totalDiscount } = row;
  const data = [
    {
      name: 'Sales',
      totalinvoiced: totalinvoiced ? totalinvoiced : 0,
      totalpaid: totalpaid ? totalpaid : 0,
      totalDiscount: totalDiscount ? totalDiscount : 0,
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
        <Bar dataKey="totalinvoiced" fill={scolor} />
        <Bar dataKey="totalpaid" stackId="a" fill={pcolor} />
        <Bar dataKey="totalDiscount" stackId="a" fill={dcolor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
