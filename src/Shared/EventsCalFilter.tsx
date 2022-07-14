/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { eventStatus } from '../constants';
import FilterSelect from './FilterSelect';
import DepartemplSelect from '../pages/options/DepartemplSelect';
import { Grid } from '@material-ui/core';
import useEmployees from '../hooks/useEmployees';
import useDepartments from '../hooks/useDepartments';

export default function EventsCalFilter({
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
  noEmpl = false,
  setResourseData,
}: any) {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  return (
    <Grid container spacing={2}>
      {!noEmpl && (
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
      )}
      <Grid item xs={2}>
        <FilterSelect
          options={departments.filter((d: any) => d.depType === 1)}
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
          setResourseData={setResourseData}
          isRTL={isRTL}
          count={count}
          theme={theme}
          refresh={refresh}
          noEmpl={noEmpl}
          employees={employees}
          departments={departments}
        ></DepartemplSelect>
      </Grid>
    </Grid>
  );
}
