/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import {
  appointmentsMainFormatter,
  expensesMainFormatter,
  kaidsMainFormatter,
  nameManageLinkFormat,
  salesMainFormatter,
  purchaseMainFormatter,
  appointmentsFormatter,
  salesFormatter,
  purchaseFormatter,
  expensesFormatter,
  kaidsFormatter,
} from './colorFormat';
import { useLazyQuery } from '@apollo/client';
import getGereralCalculation from '../graphql/query/getGereralCalculation';

export default function MainCustomer({
  isRTL,
  words,
  theme,
  name,
  id,
  value: row,
  width,
  height,
}) {
  const [data, setData] = useState<any>(null);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [currentViewName, setCurrentViewName] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const currentViewNameChange = (e: any) => {
    setCurrentViewName(e.target.value);
  };
  const currentDateChange = (curDate: any) => {
    setCurrentDate(curDate);
  };

  const endDateChange = (curDate: any) => {
    setEndDate(curDate);
  };

  const [loadCalcss, calcsData]: any = useLazyQuery(getGereralCalculation);

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadCalcss({
      variables,
    });
  }, [id, start, end]);

  useEffect(() => {
    const res = calcsData?.data?.getGereralCalculation?.data;
    if (res) {
      const data = JSON.parse(res);
      setData(data);
    }
  }, [calcsData]);

  // const totalkaids = totalkaidsdebit - totalKaidscredit;
  // const income =
  //   totalinvoiced -
  //   toatlExpenses -
  //   toatlProdExpenses -
  //   totalDiscount -
  //   totalkaids;
  return (
    <Box
      style={{
        height: height - 230,
        width: width - 300,
        margin: 10,
      }}
    >
      <Box
        style={{
          height: height - 240,
          width: width - 320,
        }}
      >
        <Box display="flex" style={{ backgroundColor: '#fff' }}>
          <DateNavigatorReports
            setStart={setStart}
            setEnd={setEnd}
            currentDate={currentDate}
            currentDateChange={currentDateChange}
            currentViewName={currentViewName}
            currentViewNameChange={currentViewNameChange}
            endDate={endDate}
            endDateChange={endDateChange}
            views={[1, 7, 30, 365, 1000]}
            isRTL={isRTL}
            words={words}
            theme={theme}
          ></DateNavigatorReports>
        </Box>
        {data && (
          <Box mt={1}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Box style={{ height: 555 }}>
                  <Box style={{ backgroundColor: '#fff', height: 285 }}>
                    {nameManageLinkFormat({
                      row,
                      value: row.name,
                      theme,
                      isRTL,
                    })}
                  </Box>
                  <Box
                    style={{
                      backgroundColor: '#fff',
                      height: 260,
                      marginTop: 10,
                    }}
                  >
                    {appointmentsMainFormatter({ row: data, theme, isRTL })}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={8}>
                <Box style={{ height: 555 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box
                        style={{
                          backgroundColor: '#fff',
                          height: 230,
                          paddingTop: 15,
                        }}
                      >
                        {salesMainFormatter({ row: data, theme, isRTL })}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        style={{
                          backgroundColor: '#fff',
                          height: 230,
                          paddingTop: 15,
                        }}
                      >
                        {purchaseMainFormatter({ row: data, theme, isRTL })}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        style={{
                          backgroundColor: '#fff',
                          height: 150,
                          paddingTop: 15,
                        }}
                      >
                        {expensesMainFormatter({ row: data, theme, isRTL })}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        style={{
                          backgroundColor: '#fff',
                          height: 150,
                          paddingTop: 15,
                        }}
                      >
                        {kaidsMainFormatter({ row: data, theme, isRTL })}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  display="flex"
                  style={{
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                    backgroundColor: colors.lime[50],
                    height: 110,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  <Box style={{ width: 270, marginLeft: 10 }}>
                    {appointmentsFormatter({ row, theme, isRTL })}
                  </Box>
                  <Box style={{ width: 270, marginLeft: 10 }}>
                    {salesFormatter({ row, theme, isRTL })}
                  </Box>
                  <Box style={{ width: 270, marginLeft: 10 }}>
                    {purchaseFormatter({ row, theme, isRTL })}
                  </Box>
                  <Box style={{ width: 200, marginLeft: 10 }}>
                    {expensesFormatter({ row, theme, isRTL })}
                  </Box>
                  <Box style={{ width: 200, marginLeft: 10 }}>
                    {kaidsFormatter({ row, theme, isRTL })}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}
