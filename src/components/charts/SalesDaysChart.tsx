/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Paper } from "@material-ui/core";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import ChartHeader from "./ChartHeader";

export const SalesDaysChart = (props: any) => {
  const { data, color, dataKey, height, isRTL, prim } = props;
  const title = isRTL ? "المبيعات اليومية" : "Days Sales";
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
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            mirror={isRTL ? true : false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip formatter={(value) => [value.toLocaleString()]} />
          <Legend
            formatter={() => (isRTL ? " المبيعات اليومية " : "Days Sales")}
          />

          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};
export default SalesDaysChart;
