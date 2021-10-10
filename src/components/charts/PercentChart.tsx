/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { fade, Paper } from "@material-ui/core";
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Label } from "recharts";
import ChartHeader from "./ChartHeader";

const PercentChart = ({ height, data, pricolor, seccolor, isRTL, prim }) => {
  let pctComplete: any;
  const completed = data.filter((d: any) => d.status === 10);
  const all = data.length;
  if (completed?.length > 0) {
    pctComplete = completed.length / all;
  } else {
    pctComplete = 0;
  }
  const rdata = [{ value: pctComplete }];
  const startPosition = 90,
    endPosition = startPosition - 360 * pctComplete;
  const value = pctComplete
    ? Math.round(pctComplete * 100).toLocaleString() + "%"
    : "0%";

  const title = isRTL ? "المواعيد المنجزة اليوم" : "Today Appointments";
  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          height={height - 50}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 70,
          }}
        >
          <Pie
            data={[{ value: 1 }]}
            innerRadius="85%"
            outerRadius="100%"
            startAngle={startPosition}
            endAngle={startPosition - 360}
            isAnimationActive={false}
            paddingAngle={0}
            fill={fade(seccolor, 0.3)}
            dataKey="value"
          />
          <Pie
            data={rdata}
            innerRadius="85%"
            outerRadius="100%"
            startAngle={startPosition}
            endAngle={endPosition}
            cornerRadius={20}
            fill={pricolor}
            dataKey="value"
            labelLine={false}
            animationBegin={0}
            animationDuration={1000}
          >
            <Label
              position="center"
              value={value}
              style={{ fontSize: 25, fontWeight: "bold" }}
              fill={pricolor}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default PercentChart;
