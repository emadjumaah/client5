/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import {
  appointmentsMainFormatter,
  expensesMainFormatter,
  kaidsMainFormatter,
  salesMainFormatter,
  purchaseMainFormatter,
  appointmentsFormatter,
  salesFormatter,
  purchaseFormatter,
  expensesFormatter,
  kaidsFormatter,
  taskDataView,
  appointTaskMainFormatter,
  salesTaskMainFormatter,
  daysdataMainFormatter,
  resourseDataView,
  employeeDataView,
  customerDataView,
  incomeMainFormatter,
  incomeFormatter,
} from './colorFormat';
import { useLazyQuery } from '@apollo/client';
import getGereralCalculation from '../graphql/query/getGereralCalculation';

export default function MainCustomer({
  open,
  isRTL,
  words,
  theme,
  name,
  id,
  value: row,
  width,
  height,
  start,
  end,
}: any) {
  const [data, setData] = useState<any>(null);

  const [loadCalcss, calcsData]: any = useLazyQuery(getGereralCalculation, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    console.log('start', start);
    console.log('end', end);
    const variables = {
      [name]: id,
      start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
      end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
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
  }, [calcsData, start, end]);

  const isCust = name === 'customerId';
  const isSupp = name === 'supplierId';
  const isTask = name === 'taskId';
  const isReso = name === 'resourseId';
  const isEmpl = name === 'employeeId';
  const isDepart = name === 'departmentId';
  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
      <Box
        style={{
          height: height - 290,
          width: width - 320,
        }}
      >
        {data && (
          <Box mt={1}>
            <Box
              style={{
                display: 'flex',
                flex: 1,
                height: 525,
                marginBottom: 10,
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Box style={{ backgroundColor: '#fff', height: 250 }}>
                    {isTask && taskDataView({ row, words, isRTL })}
                    {isReso && resourseDataView({ row, words, isRTL })}
                    {(isEmpl || isDepart) &&
                      employeeDataView({ row, words, isRTL })}
                    {(isCust || isSupp) &&
                      customerDataView({ row, words, isRTL })}
                  </Box>
                </Grid>

                {isTask && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {daysdataMainFormatter({
                        row,
                        theme,
                        isRTL,
                      })}
                    </Box>
                  </Grid>
                )}
                {isTask && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {appointTaskMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {isTask && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {salesTaskMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && !isTask && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {appointmentsMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && !isTask && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {salesMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isCust && !isTask && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {purchaseMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {expensesMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {kaidsMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {incomeMainFormatter({
                        row: data,
                        theme,
                        isRTL,
                      })}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
            <Box>
              {!isTask && (
                <Box
                  display="flex"
                  borderRadius={15}
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.indigo[50],
                    height: 145,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  {!isSupp && (
                    <Box style={{ width: 250, marginLeft: 15 }}>
                      {appointmentsFormatter({
                        row,
                        theme,
                        isRTL,
                        height: 120,
                        bc: '#bbb',
                      })}
                    </Box>
                  )}
                  {!isSupp && (
                    <Box style={{ width: 250, marginLeft: 15 }}>
                      {salesFormatter({
                        row,
                        theme,
                        isRTL,
                        height: 120,
                        bc: '#bbb',
                      })}
                    </Box>
                  )}
                  {!isCust && (
                    <Box style={{ width: 250, marginLeft: 15 }}>
                      {purchaseFormatter({
                        row,
                        theme,
                        isRTL,
                        height: 120,
                        bc: '#bbb',
                      })}
                    </Box>
                  )}
                  {!isCust && !isSupp && (
                    <Box style={{ width: 250, marginLeft: 15 }}>
                      {expensesFormatter({
                        row,
                        theme,
                        isRTL,
                        height: 120,
                        bc: '#bbb',
                      })}
                    </Box>
                  )}
                  {!isCust && !isSupp && (
                    <Box style={{ width: 250, marginLeft: 15 }}>
                      {kaidsFormatter({
                        row,
                        theme,
                        isRTL,
                        height: 120,
                        bc: '#bbb',
                      })}
                    </Box>
                  )}
                  {!isSupp && (
                    <Box style={{ width: 250, marginLeft: 15 }}>
                      {incomeFormatter({
                        row,
                        theme,
                        isRTL,
                        height: 120,
                        bc: '#bbb',
                      })}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
