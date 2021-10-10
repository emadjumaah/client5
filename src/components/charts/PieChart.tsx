/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import {
  Chart,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { EventTracker, Palette } from "@devexpress/dx-react-chart";

const PieChart = ({ data, size, valueField, argumentField }) => {
  const name = data?.[0]?.departmentNameAr
    ? "departmentNameAr"
    : data?.[0]?.employeeNameAr
    ? "employeeNameAr"
    : "amount";
  if (data) {
    data.sort((a: any, b: any) =>
      a[name] < b[name] ? 1 : b[name] < a[name] ? -1 : 0,
    );
  }

  const scheme = [
    "#717EC3",
    "#2AB7CA",
    "#FFA8A9",
    "#A14A76",
    "#E8DB7D",
    "#558C8C",
    "#8DE969",
    "#231123",
    "#EE8434",
    "#FE4A49",
    "#151060",
    "#EFF7FF",
  ];
  return (
    <Chart data={data} width={size} height={size}>
      <Palette scheme={scheme} />

      <PieSeries valueField={valueField} argumentField={argumentField} />
      <EventTracker />
      <Tooltip />
    </Chart>
  );
};
export default PieChart;
