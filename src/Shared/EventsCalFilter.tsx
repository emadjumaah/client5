/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { eventStatus } from "../constants";
import FilterSelect from "./FilterSelect";
import DepartemplSelect from "../pages/options/DepartemplSelect";
import { Grid } from "@material-ui/core";

export default function EventsCalFilter({
  employees,
  departments,
  departvalue,
  setDepartvalue,
  emplvalue,
  setEmplvalue,
  status,
  setStatus,
  mainResourceName,
  setMainResourceName,
  words,
  isRTL,
  count,
  theme,
  refresh,
}: any) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <FilterSelect
          options={employees}
          value={emplvalue}
          setValue={setEmplvalue}
          words={words}
          isRTL={isRTL}
          name="employee"
          fullWidth
        ></FilterSelect>
      </Grid>
      <Grid item xs={2}>
        <FilterSelect
          options={departments}
          value={departvalue}
          setValue={setDepartvalue}
          words={words}
          isRTL={isRTL}
          name="department"
          fullWidth
        ></FilterSelect>
      </Grid>
      <Grid item xs={2}>
        <FilterSelect
          options={eventStatus}
          value={status}
          setValue={setStatus}
          words={words}
          isRTL={isRTL}
          name="status"
          fullWidth
        ></FilterSelect>
      </Grid>
      <Grid item xs={6}>
        <DepartemplSelect
          value={mainResourceName}
          setValue={setMainResourceName}
          isRTL={isRTL}
          count={count}
          theme={theme}
          refresh={refresh}
        ></DepartemplSelect>
      </Grid>
    </Grid>
  );
}
