import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function PurchaseChart({
  row,
  scolor,
  pcolor,
  dcolor,
  height,
}: any) {
  const { totalPurchaseInvoiced, totalPurchasePaid, totalPurchaseDiscount } =
    row;
  const data = [
    {
      name: 'Purchase',
      totalPurchaseInvoiced: totalPurchaseInvoiced ? totalPurchaseInvoiced : 0,
      totalPurchasePaid: totalPurchasePaid ? totalPurchasePaid : 0,
      totalPurchaseDiscount: totalPurchaseDiscount ? totalPurchaseDiscount : 0,
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
        <Bar dataKey="totalPurchaseInvoiced" fill={scolor} />
        <Bar dataKey="totalPurchasePaid" stackId="a" fill={pcolor} />
        <Bar dataKey="totalPurchaseDiscount" stackId="a" fill={dcolor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
