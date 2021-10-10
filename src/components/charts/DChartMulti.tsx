/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Paper } from "@material-ui/core";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const DChartMulti = (props: any) => {
  const { data, isRTL, list, listname } = props;
  const readyData =
    data && data.length > 0
      ? data.map((d: any) => {
          const obj = {};
          const name = d.name;
          list.map((emp: any) => {
            const ename = isRTL ? emp.nameAr : emp.name;
            const empdata = d[listname].filter((em: any) => em.name === ename);
            obj[ename] = empdata?.[0]?.amount || 0;
          });

          return {
            name,
            ...obj,
          };
        })
      : [];

  return (
    <Paper style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          height={300}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 20,
          }}
          data={readyData}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend />
          {list.map((emp: any) => {
            const dataKey = isRTL ? emp.nameAr : emp.name;
            return (
              <Line type="monotone" dataKey={dataKey} stroke={emp.color} />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};
export default DChartMulti;
