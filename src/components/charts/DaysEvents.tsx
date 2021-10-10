/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Paper } from "@material-ui/core";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getThemeStatus } from "../../constants/datatypes";
import ChartHeader from "./ChartHeader";

export const DaysEvents = (props: any) => {
  const { data, isRTL, height, prim, theme } = props;
  const name = isRTL ? "nameAr" : "name";

  const rdata = data.map((d: any) => {
    const obj = d;
    if (d.status && d.status.length > 0) {
      d.status.map((ds: any) => {
        obj[ds.name] = ds.count;
      });
    }
    return obj;
  });
  const title = isRTL
    ? "المواعيد اليومية بحسب الحالة"
    : "Week Appointments Status";

  const stats = getThemeStatus(theme);
  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <ResponsiveContainer width="100%" height={height - 60}>
        <BarChart
          height={height}
          data={rdata}
          margin={{
            top: 20,
            right: 10,
            left: isRTL ? 40 : 0,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            mirror={isRTL ? true : false}
          />
          <Tooltip cursor={{ fill: "transparent" }} />
          {stats.map((es: any) => {
            return (
              <Bar key={es.id} dataKey={es[name]} stackId="a" fill={es.color} />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DaysEvents;
