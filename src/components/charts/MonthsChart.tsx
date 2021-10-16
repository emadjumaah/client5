/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { fade, Paper } from '@material-ui/core';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ChartHeader from './ChartHeader';

export const MonthsChart = (props: any) => {
  const { data, color, dataKey, height, prim, title, isRTL } = props;
  const ucolor = fade(color, 0.7);
  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <ResponsiveContainer width="100%" height={height - 60}>
        <BarChart
          height={height}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: isRTL ? 50 : 10,
            bottom: 5,
          }}
          syncId="6month"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            mirror={isRTL ? true : false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            formatter={(value) => [value.toLocaleString()]}
          />
          <Bar dataKey={dataKey} fill={ucolor} />;
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MonthsChart;
