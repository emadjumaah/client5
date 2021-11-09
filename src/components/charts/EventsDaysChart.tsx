/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Paper } from '@material-ui/core';
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import ChartHeader from './ChartHeader';

export const EventsDaysChart = (props: any) => {
  const { data, pricolor, seccolor, dataKey, height, isRTL, prim } = props;

  const ndata = data.map((d: any) => {
    return {
      ...d,
      Completed: d.Completed ? d.Completed : 0,
      منجز: d['منجز'] ? d['منجز'] : 0,
    };
  });

  const title = isRTL ? 'الموعيد اليومية المنجزة' : 'Daily Appointments';
  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <ResponsiveContainer width="100%" height={height - 30}>
        <AreaChart
          height={height}
          margin={{
            top: 20,
            right: 30,
            left: isRTL ? 40 : 10,
            bottom: 20,
          }}
          syncId="anyId"
          data={ndata}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            mirror={isRTL ? true : false}
          />
          <Tooltip
            formatter={(value: any, name: string) => [
              value,
              name === 'count' ? (isRTL ? 'الكل' : 'All') : name,
            ]}
          />
          <Legend
            formatter={(value) => {
              return value === 'count'
                ? isRTL
                  ? 'كل المواعيد'
                  : 'All Appointments'
                : isRTL
                ? 'المواعيد المنجزة'
                : 'Completed';
            }}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            fill={seccolor}
            stroke={seccolor}
          />
          <Area
            type="monotone"
            dataKey={isRTL ? 'منجز' : 'Completed'}
            stroke={pricolor}
            fill={pricolor}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};
export default EventsDaysChart;
