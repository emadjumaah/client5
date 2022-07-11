/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { eventStatus } from '../constants';
import { moneyFormat } from './colorFormat';
import FilterSelect from './FilterSelect';
import { periods } from '../constants/datatypes';
export default function EventsFilter({
  employees,
  departments,
  services,
  servicevalue,
  setServicevalue,
  departvalue,
  setDepartvalue,
  emplvalue,
  setEmplvalue,
  customers,
  custvalue,
  setCustvalue,
  start,
  setStart,
  end,
  setEnd,
  status,
  setStatus,
  total,
  words,
  isRTL,
  periodvalue,
  setPeriodvalue,
}: any) {
  return (
    <Box>
      <Box
        display="flex"
        style={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box
          display="flex"
          border={1}
          borderColor="#ddd"
          style={{
            position: 'absolute',
            left: isRTL ? 20 : undefined,
            right: isRTL ? undefined : 20,
            top: 30,
            borderRadius: 10,
            backgroundColor: '#f8f8f8',
          }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label={words.fromdate}
              value={start}
              onChange={setStart}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{ width: 150, marginLeft: 20, marginRight: 20 }}
            />
            <KeyboardDatePicker
              autoOk
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label={words.todate}
              value={end}
              onChange={setEnd}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{ width: 150 }}
            />
          </MuiPickersUtilsProvider>
          <Box display="flex" style={{ marginTop: 13 }}>
            <FilterSelect
              options={periods}
              value={periodvalue}
              setValue={setPeriodvalue}
              words={words}
              isRTL={isRTL}
              name="period"
              width={170}
            ></FilterSelect>
            <FilterSelect
              options={eventStatus}
              value={status}
              setValue={setStatus}
              words={words}
              isRTL={isRTL}
              name="status"
            ></FilterSelect>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        style={{ position: 'absolute', marginTop: 10, zIndex: 111 }}
      >
        <FilterSelect
          options={employees}
          value={emplvalue}
          setValue={setEmplvalue}
          words={words}
          isRTL={isRTL}
          name="employee"
        ></FilterSelect>
        <FilterSelect
          options={departments.filter((d: any) => d.depType === 1)}
          value={departvalue}
          setValue={setDepartvalue}
          words={words}
          isRTL={isRTL}
          name="department"
        ></FilterSelect>
        {/* <FilterSelect
          options={categories}
          value={catvalue}
          setValue={setCatvalue}
          words={words}
          isRTL={isRTL}
          name="category"
        ></FilterSelect> */}
        <FilterSelect
          options={services}
          value={servicevalue}
          setValue={setServicevalue}
          words={words}
          isRTL={isRTL}
          name="service"
        ></FilterSelect>

        <FilterSelect
          options={customers}
          value={custvalue}
          setValue={setCustvalue}
          words={words}
          isRTL={isRTL}
          name="customer"
        ></FilterSelect>

        {total && total.length > 0 && (
          <Box
            display="flex"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Box style={{ marginLeft: 20, marginRight: 20 }}>
              <Typography variant="subtitle1">
                {words.appointments}: {total[0].count}
              </Typography>
            </Box>
            <Box style={{ marginLeft: 20, marginRight: 20 }}>
              <Typography variant="h6">
                {words.total}: {moneyFormat(total[0].total)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
